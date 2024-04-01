import { StyleSheet, Image, Button, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl} from 'react-native';
import { Text, View } from '@/components/Themed';
import React, {useEffect, useState} from 'react';
import { Dimensions } from 'react-native';
import {addUserData, getUserData , getPosts, addPost, getUserByDocId} from '../../../services/firebaseService.js'
import { useUser } from '../../../constants/UserContext';
import { FlatList,  Appearance, StatusBar  } from 'react-native';
import {CUSTOMCOLORS} from '../../../constants/CustomColors';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUserData } from '../../../constants/authService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function TabOneScreen({}) {
  const { user: currentUser, setUser } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery] = useState('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
	const [usernameState, setUsernameState] = React.useState();
  const currentUserId = currentUser?.id;

	const getUsername = async () => {
		const docSnap = await getUserByDocId(currentUser?.id || '0');
		setUsernameState(currentUser? docSnap.data().Name : "");
	};
	useFocusEffect(
		React.useCallback(() => {
			getUsername();
		}, [])
	);

const handleSearch = async () => {
    try {
      console.log("SEARCHING...");
      const results = await getPosts(currentUserId || '-1');
      const postsArray = await Promise.all(results.map(async (result) => {
        const { latitude, longitude } = result.location;
        const address = await fetchAddress(latitude, longitude);
        return {
          id: result.id,
          address,
          ...result
        };
      }));
      setPosts(postsArray);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  
  
  useEffect(() => {
    handleSearch(); // Call handleSearch when the component mounts or currentUser.id changes
  }, [currentUser?.id, searchQuery]);

	useEffect(() => {
		Appearance.setColorScheme('light');
		StatusBar.setBarStyle('dark-content');
	}, []);

  // Function to fetch address from Google Geocoding API
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBCs6VRQAtgywJkLYMSQR2B5We3kAIwUUo`);
      const data = await response.json();
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


  return (
	<View style={[styles.testBorder, styles.container]}>
		<TouchableOpacity style={[styles.testBorder, styles.imageButton]}>
			<Image style={[styles.testBorder, styles.profileImage]}
				source={{uri: currentUser.icon || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1024px-Default_pfp.svg.png' }}/>
		</TouchableOpacity>

		<Text style={[styles.testBorder, styles.profileName]}>
			{currentUser?.displayName || 'Guest User'}
		</Text>

		<TouchableOpacity style={[styles.testBorder, styles.reloadButton]} onPress={async () => {
				await fetchUserData(currentUser.id, setUser);
			}}>
			<Icon name="reload" size={30} color={CUSTOMCOLORS.darkPurple} />
		</TouchableOpacity>

		<View style={[styles.testBorder, styles.divider]}>
			<View style={styles.hrLine} />
			<Text style={[styles.testBorder, styles.dividerText]}>My Posts</Text>
			<View style={styles.hrLine} />
		</View>
		<FlatList
			data={posts}
			style={[styles.flatList, styles.testBorder]}
			showsVerticalScrollIndicator={false}
			renderItem={({ item }) => (
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
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleSearch} />}
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

	imageButton : {
		alignSelf: 'center',
		margin: 10,
	},
	profileImage: {
		width: 130,
		height: 130,
		borderRadius: 130/2,
	},
	
	profileName: {
		margin: 10,
		fontSize: 25,
		fontWeight: 'bold',
		alignSelf: 'center',
		color: CUSTOMCOLORS.darkGray,
	},

	reloadButton: {
		position: 'absolute',
		top: 10,
		right: 10,
	},

	divider: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10,
		backgroundColor: 'transparent',
	},
	hrLine: {
		flex: 1,
		backgroundColor: CUSTOMCOLORS.lightPurple,
		height: 1,
	},
	dividerText: {
		color: CUSTOMCOLORS.darkPurple,
		textAlign: 'center',
		fontSize: 20,
		paddingHorizontal: 10,
		marginBottom: 5,
	},

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  profile: {
    paddingTop: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: CUSTOMCOLORS.offWhite,
  },
  
  profileBio:{
    marginTop: 8,
    fontSize: 17,
    color: "#989898",
    textAlign: 'center',
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
  postContent: {
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  rewardText: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lostItemBorder: {
		borderColor: CUSTOMCOLORS.lostRed,
	},
	foundItemBorder: {
		borderColor: CUSTOMCOLORS.foundYellow,
	},
	returnedItemBorder: {
		borderColor: CUSTOMCOLORS.returnedGreen,
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
  flatList: {
    margin: 10,
  },
  block: {
    backgroundColor: CUSTOMCOLORS.veryLightPurple,
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
});
