import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet, TextInput, Dimensions, FlatList, RefreshControl, Appearance, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, View } from '@/components/Themed';
import {CUSTOMCOLORS} from '../../constants/CustomColors';
import { LocationData, getLocation } from './postfolder/locationUtil';

import { getPosts } from '../../services/firebaseService';
import Slider from '@react-native-community/slider';

export default function TabOneScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [sliderVal, setSliderVal] = useState(3); // State to track selected radius
  

  useEffect(() => {
    // Fetch user's location
    console.log("HERE before get location");
    getLocation()
      .then(location => {
        setUserLocation(location);
      })
      .catch(error => {
        console.error("Error fetching user location:", error);
        // Optionally, you can handle the error here by setting userLocation to a default value or displaying an error message.
      });
  }, []);

  // Watch for changes in sliderVal and trigger handleSearch
  useEffect(() => {
    handleSearch();
  }, [sliderVal]);


  const handleSearch = async () => {
    try {
      const userLocationData = await getLocation();
      setUserLocation(userLocationData);
      console.log("userLocationData", userLocationData);
      const results = await getPosts(searchQuery);
      const postsArray = await Promise.all(results.map(async (result) => {
        const { latitude, longitude } = result.location;
        const address = await fetchAddress(latitude, longitude);
        return {
          id: result.id,
          address,
          ...result
        };
      }));

      // Filter posts based on the selected radius
    const filteredPosts = postsArray.filter(post => {
      if (userLocationData.latitude !== null && userLocationData.longitude !== null) {
        const distance = calculateDistance(userLocationData.latitude, userLocationData.longitude, post.location.latitude, post.location.longitude);
        // Check if the post is within the selected radius
        console.log("sliderVal", sliderVal);
        switch (sliderVal) {
          case 0:
            return distance <= 1; // 1 mile
          case 1:
            return distance <= 2; // 2 miles
          case 2:
            return distance <= 5; // 5 miles
          case 3:
            return true; // All posts
          default:
            return true;
        }
      } else {
        // If userLocation is null, show all posts
        return true;
      }
    });

    


      // Sort posts based on user's location
    const sortedPosts = [...filteredPosts].sort((postA, postB) => {
      if (userLocationData.latitude !== null && userLocationData.longitude !== null) {
        console.log("reached inner handleSearch");
        // Assigning latitude and longitude values for postA and postB if they are null
        const postALatitude = postA.location.latitude !== null ? postA.location.latitude : 180;
        const postALongitude = postA.location.longitude !== null ? postA.location.longitude : 180;
        const postBLatitude = postB.location.latitude !== null ? postB.location.latitude : 180;
        const postBLongitude = postB.location.longitude !== null ? postB.location.longitude : 180;

        const distanceA = calculateDistance(userLocationData.latitude, userLocationData.longitude, postALatitude, postALongitude);
        const distanceB = calculateDistance(userLocationData.latitude, userLocationData.longitude, postBLatitude, postBLongitude);
        console.log(distanceA - distanceB);
        return distanceA - distanceB;
      }
      else {
        console.log("AT ELSE STATEMENT");
        // If userLocation is null, calculate distance from default location (34.4133, -119.8610)
        const postALatitude = postA.location.latitude !== null ? postA.location.latitude : 180;
        const postALongitude = postA.location.longitude !== null ? postA.location.longitude : 180;
        const postBLatitude = postB.location.latitude !== null ? postB.location.latitude : 180;
        const postBLongitude = postB.location.longitude !== null ? postB.location.longitude : 180;
    
        const distanceA = calculateDistance(34.4133, -119.8610, postALatitude, postALongitude);
        const distanceB = calculateDistance(34.4133, -119.8610, postBLatitude, postBLongitude);
        return distanceA - distanceB;
      }
      return 0;
    });
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
    
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleSearch().then(() => setRefreshing(false));
  }, []);

    useEffect(() => {
      handleSearch()
    }, [searchQuery]);

    useEffect(() => {

    Appearance.setColorScheme('light');
    StatusBar.setBarStyle('dark-content');
  }, []);

  // Function to fetch address from Google Geocoding API
  const fetchAddress = async (latitude, longitude) => {
    console.log("fetchAddress");
    try {
      console.log("latitude", latitude);
      console.log("longitude", longitude);
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBCs6VRQAtgywJkLYMSQR2B5We3kAIwUUo`);
      const data = await response.json();
      console.log("waiting on response");
      if (data.results && data.results.length > 0) {
        console.log("success fetchAddress");
        return data.results[0].formatted_address;
      }
    } catch (error) {
      console.log("error");
      console.error('Error fetching address:', error);
    }
    console.log("return null");
    return null;
  };

  // Function to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // Distance in km
  };

  /*
  useEffect(() => {
    // Sort posts based on distance from user's location
    if (userLocation !== null) {
    console.log("userLocation", userLocation.latitude + " " + userLocation.longitude);
      console.log("reached");
    if (userLocation.latitude !== 0 && userLocation.longitude !== 0) {
      const sortedPosts = [...posts].sort((postA, postB) => {
        const distanceA = calculateDistance(userLocation.latitude, userLocation.longitude, postA.location.latitude, postA.location.longitude);
        const distanceB = calculateDistance(userLocation.latitude, userLocation.longitude, postB.location.latitude, postB.location.longitude);
        return distanceA - distanceB;
      });
      setPosts(sortedPosts);
    }
  }
  }, [userLocation]); */

  const handleSliderChange = (value: number) => {
    let newRadius = -1;
    // Here you can trigger the search based on the selected radius
    switch (value) {
      case 0:
        newRadius = 0; 
        break;
      case 1:
        newRadius = 1; 
        break;
      case 2:
        newRadius = 2; 
        break;
      case 3:
        newRadius = 3; 
        break;
      default:
        break;
      }
      console.log("newRadius", newRadius);
      setSliderVal(newRadius);
    //handleSearch();
    };

  return (
    <View style={[styles.container, styles.testBorder]}>
      <Text style={[styles.recentPostsHeader, styles.testBorder]}>Recent Posts</Text>
      <View style={[styles.searchFunc, styles.testBorder]}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search tags"
          placeholderTextColor={CUSTOMCOLORS.lightGray}
          value={searchQuery}
          onChangeText={setSearchQuery}
          cursorColor={CUSTOMCOLORS.lightPurple}
          selectionColor={CUSTOMCOLORS.lightPurple}
        />
    {/*
        <TouchableOpacity onPress={handleSearch} style={styles.searhIconBackground}>
          <Icon name="search" size={30} color={CUSTOMCOLORS.darkPurple} />
        </TouchableOpacity>
    */}
      </View>

    <View style={styles.divider}></View>

    {/* Slider for selecting radius */}
<View style={styles.radiusSliderContainer}>
<Slider
style={{width: '80%', height: 40}}
minimumValue={0}
maximumValue={3}
step={1}
value={sliderVal}
onValueChange={handleSliderChange}
minimumTrackTintColor={CUSTOMCOLORS.darkPurple}
maximumTrackTintColor={CUSTOMCOLORS.lightPurple}
thumbTintColor={CUSTOMCOLORS.darkPurple}
/>
<View style={styles.sliderOptionsContainer}>
<Text style={styles.sliderOptionText}>1mi</Text>
<Text style={styles.sliderOptionText}>2mi</Text>
<Text style={styles.sliderOptionText}>5mi</Text>
<Text style={styles.sliderOptionText}>All</Text>
</View>
</View>

    

      <FlatList
        data={posts}
        style={[styles.flatList, styles.testBorder]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          //<View style={[styles.block, item.lostFound === 'lost' ? styles.lostItemBackground : styles.foundItemBackground, styles.testBorder]}>
          <View style={[styles.testBorder, styles.block, item.lostFound === 'returned' ? styles.returnedItemBackground : styles.block, item.lostFound === 'lost' ? styles.lostItemBorder : styles.foundItemBorder]}>
      <View style={[styles.testBorder, styles.titleWrapper]}>
        <Text style={[styles.testBorder, styles.inblocktitle]}>{item.title}</Text>
        <Text style={[styles.testBorder, styles.inblockstatus, 
          item.lostFound === 'returned' ? 
            styles.statusReturnedBackground : (item.lostFound === 'lost' ? 
              styles.statusLostBackground : styles.statusFoundBackground
            )]}>
              {item.lostFound === 'returned' ? 'Returned' : (item.lostFound === 'lost' ? 'Lost' : 'Found')}
        </Text>
      </View>
            {item.media && item.media.length > 0 && (
              <Image source={{ uri: item.media[0] }} style={[styles.testBorder, styles.postImage]} resizeMode="cover" />
            )}
            {/*<Text style={[styles.inblocktext, item.lostFound === 'lost' ? styles.lostTextBackground : styles.foundTextBackground]}>{item.description}</Text>*/}
            <Text style={[styles.testBorder, styles.inblocktext]}>{item.description.trim()}</Text>

      <View style={styles.divider}></View>

            {item.lostFound === 'lost' && item.reward && <Text style={styles.inblocktext}>Reward: ${item.reward}</Text>}
            {item.address && <Text style={styles.inblocktext}>Location: {item.address}</Text>}
            <Text style={styles.inblocktext}>Date: {new Date(item.postTime?.seconds * 1000).toLocaleDateString("en-US")}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: CUSTOMCOLORS.offWhite,
    padding: 10,
    },
  testBorder: {
    borderWidth: 0,
    borderColor: 'red',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: CUSTOMCOLORS.lightPurple,
    marginVertical: 10,
  },

  recentPostsHeader: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: CUSTOMCOLORS.darkGray,
    fontSize: 20,
    margin: 10,
  },

    searchFunc: {
      flexDirection: 'row',
      alignItems: 'center',
    margin: 10,
    height: 40,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    width: '80%',
    },
    searchBar: {
      flex: 1,
      height: 30,
      borderBottomWidth: 1,
      borderColor: CUSTOMCOLORS.darkPurple,
    paddingHorizontal: 5,
    fontSize: 15,
    },
    searhIconBackground: {
      backgroundColor: CUSTOMCOLORS.lightPurple,
    height: 40,
    width: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },

  flatList: {
    margin: 10,
  },
    block: {
      backgroundColor: CUSTOMCOLORS.veryLightPurple,
      padding: 10,
      borderRadius: 10,
      marginVertical: 5,
    //borderWidth: 1,
    /*
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    */
    },

  titleWrapper: {
    //flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginBottom: 5,
  },
  inblocktitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginHorizontal: 5,
    color: CUSTOMCOLORS.darkGray,
    flexShrink: 1,
    },
  inblockstatus: {
      fontSize: 15,
      fontWeight: 'bold',
      color: CUSTOMCOLORS.darkGray,
    margin: 5,
    borderRadius: 20,
    paddingVertical: 1,
    paddingHorizontal: 10,
    },
  statusLostBackground: {
    backgroundColor: CUSTOMCOLORS.lostRed,
  },
  statusFoundBackground: {
    backgroundColor: CUSTOMCOLORS.foundYellow,
  },
  statusReturnedBackground: {
    backgroundColor: CUSTOMCOLORS.returnedGreen,
  },
    postImage: {
      width: 'auto',
      height: undefined,
      aspectRatio: 1,
      borderRadius: 10,
    },
    inblocktext: {
      fontSize: 15,
      margin: 5,
    color: CUSTOMCOLORS.darkGray,
    },
  /*
  rewardText: {
      fontSize: 16,
      color: '#FFA500',
      fontWeight: 'bold',
      marginBottom: 5,
    },
    lostItemBackground: {
      backgroundColor: '#FFEEEE',
    },
    foundItemBackground: {
      backgroundColor: '#EEEEFF',
    },
    lostTextBackground: {
      backgroundColor: '#FFEEEE',
      padding: 5,
      borderRadius: 5,
    },
    foundTextBackground: {
      backgroundColor: '#EEEEFF',
      padding: 5,
      borderRadius: 5,
    },
  */
  lostItemBorder: {
    borderColor: CUSTOMCOLORS.lostRed,
  },
  foundItemBorder: {
    borderColor: CUSTOMCOLORS.foundYellow,
  },
  returnedItemBorder: {
    borderColor: CUSTOMCOLORS.returnedGreen,
  },
    postContent: {
      flex: 1,
    },
    
    locationText: {
      fontSize: 14,
      color: '#777',
      marginBottom: 5,
    },
    radiusSliderContainer: {
      alignItems: 'center',
      marginBottom: 10,
      },
      sliderOptionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      },
      sliderOptionText: {
      color: CUSTOMCOLORS.darkGray,
      fontSize: 12,
      },
  });