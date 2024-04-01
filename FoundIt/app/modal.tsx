import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, Button, View, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { getLocation, LocationData } from './(tabs)/postfolder/locationUtil';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CUSTOMCOLORS} from '../constants/CustomColors'

export default function ModalScreen() {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [pinLocation, setPinLocation] = useState<LocationData | null>(null);
  const [locationLoaded, setLocationLoaded] = useState<boolean>(false);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity
					style={{marginRight: 10}}
					onPress={() => navigateToPost()}
				>
					<Icon name="keyboard-backspace" size={30} color={CUSTOMCOLORS.darkPurple} />
				</TouchableOpacity>
			),
		});
	}, [navigation]);


  useEffect(() => {
    handleLocationFetch();
  }, []);

  const handleLocationFetch = async () => {
    try {
      const location = await getLocation();
      setCurrentLocation(location);
      setPinLocation(location);
      setLocationLoaded(true);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const handlePress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPinLocation({ latitude, longitude });
  };

  const confirmLocation = () => {
    if (pinLocation) {
      navigation.navigate('postfolder/post', { selectedLocation: pinLocation });
    }
  };
  const navigateToPost = () => {
      navigation.navigate('postfolder/post');
	};

  return (
    <View style={[styles.testBorder, styles.container]}>
      <MapView
        style={[styles.testBorder, styles.map]}
        region={locationLoaded && currentLocation ? {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : undefined}
        onPress={handlePress}
        showsUserLocation={true}
      >
        {pinLocation && (
          <Marker
            coordinate={pinLocation}
            draggable
            onDragEnd={(e) => setPinLocation(e.nativeEvent.coordinate)}
            title="Selected Location"
            description="Hold and drag to move pin"
          />
        )}
      </MapView>
      {/* Wrapper view for the button */}
		<TouchableOpacity style={[styles.testBorder, styles.confirmLocation]} onPress={confirmLocation}>
			<Text style={[styles.text, styles.confirmLocationText]}>Confirm Location</Text>
		</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
	testBorder: {
		borderWidth: 0,
		borderColor: 'red',
	},
	text: {
		fontSize: 15,
		color: CUSTOMCOLORS.darkGray,
	},
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20, // Adjust the distance from the bottom
    alignSelf: 'center',
  },
  confirmLocation: {
	borderRadius: 25,
	height: 50,
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: CUSTOMCOLORS.darkPurple,
	position: 'absolute',
	bottom: 20,
	alignSelf: 'center',
	paddingHorizontal: 15,
  },
  confirmLocationText: {
	color: CUSTOMCOLORS.veryLightPurple,
	fontWeight: 'bold',	
  }
});
