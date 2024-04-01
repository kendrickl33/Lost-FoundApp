import * as Location from 'expo-location';

// Define an interface for the location object
export interface LocationData {
  latitude: number;
  longitude: number;
}

// Function to fetch the user's current location
export const getLocation = async (): Promise<LocationData> => {
  console.log("entered function");
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log("permission not granted");
    throw new Error('Permission to access location was denied');
  }
  console.log("permission granted");

  let { coords } = await Location.getLastKnownPositionAsync();
  console.log("coords: ", coords);
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
};
