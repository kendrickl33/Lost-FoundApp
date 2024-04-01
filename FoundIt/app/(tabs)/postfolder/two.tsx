import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Text, TouchableWithoutFeedback, Modal, GestureResponderEvent, ScrollView, Dimensions, } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Video } from 'expo-av';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { CUSTOMCOLORS } from '../../../constants/CustomColors';


const CameraPage: React.FC = () => {
  const cameraRef = useRef<Camera | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [media, setMedia] = useState<Array<{ uri: string; type: 'image' | 'video' }>[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const lastTapRef = useRef<number>(0);
  let pressTimer: NodeJS.Timeout | null = null;
  const [fullScreenPreviewVisible, setFullScreenPreviewVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<ParamListBase, string, any, any, any>>();
  const [autoFocus, setAutoFocus] = useState(Camera.Constants.AutoFocus.on);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showFocusIndicator, setShowFocusIndicator] = useState(false);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
      }
  })();
  }, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity
					style={{paddingLeft: 10}}
					onPress={() => navigateToPost()}
				>
					<Icon name="keyboard-backspace" size={30} color={CUSTOMCOLORS.darkPurple} />
				</TouchableOpacity>
			),
		});
	}, [navigation]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false, // Set to false to allow multiple selections
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true, // Enable multiple selections
    });

    if (!result.canceled && result.assets) {
      // Update to handle multiple media items
      const selectedMedia = result.assets.map(asset => ({
        uri: asset.uri,
        type: asset.mediaType || 'image', // Ensure type is set correctly
      }));
      setMedia(selectedMedia);
      setFullScreenPreviewVisible(true); // Optionally, adjust or remove this based on your UI/UX preferences
    }
  };



  const toggleFlashMode = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const handleTap = (evt: GestureResponderEvent) => {
    const { locationX, locationY } = evt.nativeEvent;
    setTapPosition({ x: locationX, y: locationY });
    setShowFocusIndicator(true);
    setTimeout(() => setShowFocusIndicator(false), 800); // Hide the indicator after .8s

    const now = Date.now();
    if (lastTapRef.current && now - lastTapRef.current < 300) {
        setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
    } else {
        setAutoFocus(autoFocus === Camera.Constants.AutoFocus.on ? Camera.Constants.AutoFocus.off : Camera.Constants.AutoFocus.on);
    }
    lastTapRef.current = now;
    };

    const FocusIndicator = ({ position }: { position: { x: number; y: number } }) => (
    <View
        style={{
            position: 'absolute',
            left: position.x - 40,
            top: position.y - 40,
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 2,
            borderColor: 'white',
            opacity: 0.7,
        }}
    />
  );


  const takePicture = async () => {
    if (cameraRef.current && !isRecording) {
      const photo = await cameraRef.current.takePictureAsync();
      // Wrap the photo object in an array when setting the media state
      setMedia([{ uri: photo.uri, type: 'image' }]);
      setFullScreenPreviewVisible(true);
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        // Wrap the video object in an array when setting the media state
        setMedia([{ uri: video.uri, type: 'video' }]);
      } catch (error) {
        console.error("Error during recording: ", error);
      } finally {
        setIsRecording(false);
      }
    }
  };


  const handlePressIn = () => {
    pressTimer = setTimeout(async () => {
      await startRecording();
    }, 300);
  };

  const handlePressOut = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
      if (!isRecording) {
        takePicture();
      } else {
        if (cameraRef.current) {
          cameraRef.current.stopRecording();
          setIsRecording(false);
        }
      }
    }
  };

  const toggleFullScreenPreview = () => {
    setFullScreenPreviewVisible(!fullScreenPreviewVisible);
  };

  const navigateToPost = () => {
    navigation.navigate('postfolder/post', { media: media });
    setFullScreenPreviewVisible(false);
    setMedia([]);
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={(evt) => handleTap(evt)}>
        <View style={{ flex: 1 }}>
          <Camera style={[styles.testBorder, styles.camera]} type={type} flashMode={flashMode} autoFocus={autoFocus} ref={cameraRef} ratio="16:9">
            <TouchableOpacity style={styles.flashButton} onPress={toggleFlashMode}>
              <Icon name={flashMode === Camera.Constants.FlashMode.on ? "flash" : "flash-off"} size={24} color="white" />
            </TouchableOpacity>
            {showFocusIndicator && <FocusIndicator position={tapPosition} />}
          </Camera>
        </View>
      </TouchableWithoutFeedback>
        <View style={styles.controls}>

        <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
          <Icon name="image-multiple" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.captureButton, isRecording && { borderColor: 'red' }]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.innerRing}>
            <View style={[styles.innerCircle, isRecording && { backgroundColor: 'red' }]} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}>
          <Icon name="camera-switch" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {media.uri && (
        <TouchableOpacity style={styles.preview} onPress={toggleFullScreenPreview}>
          {media.type === 'image' ? (
            <Image
            source={{ uri: media.uri }}
            style={styles.fullScreen}
        />
          ) : (
            <Video source={{ uri: media.uri }} style={styles.fullScreen} isLooping useNativeControls />
          )}
        </TouchableOpacity>
      )}
      {fullScreenPreviewVisible && (
  <Modal
    animationType="slide"
    transparent={false}
    visible={fullScreenPreviewVisible}
    onRequestClose={() => setFullScreenPreviewVisible(false)}
  >
    <ScrollView
      horizontal={true}
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}
      style={[styles.testBorder, styles.container]}
    >
      {media.map((item, index) => (
        item.type === 'image' ? (
          <Image
            key={index}
            source={{ uri: item.uri }}
            style={styles.fullScreenImage}
          />
        ) : (
          <Video
            key={index}
            source={{ uri: item.uri }}
            style={styles.fullScreenImage} // Adjust style as needed
            isLooping
            useNativeControls
            resizeMode="contain"
          />
        )
      ))}
    </ScrollView>
    
	<View style={[styles.testBorder, styles.backNextButtonsWrapper]}>
		<TouchableOpacity style={styles.closeButton} onPress={() => setFullScreenPreviewVisible(false)}>
			<Icon name="close" size={50} color={CUSTOMCOLORS.darkPurple} />
		</TouchableOpacity>
		<TouchableOpacity style={styles.nextButton} onPress={() => navigateToPost()}>
			<Icon name="arrow-right" size={50} color={CUSTOMCOLORS.darkPurple} />
		</TouchableOpacity>
	</View>
  </Modal>
)}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CUSTOMCOLORS.offWhite,
  },
	testBorder: {
		borderWidth: 0,
		borderColor: 'red',
	},
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
	resizeMode: 'contain',
  },
  flashButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    padding: 2,
  },
  innerRing: {
    width: '100%',
    height: '100%',
    borderRadius: 35.5,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  innerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    backgroundColor: 'white',
  },
  preview: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  backNextButtonsWrapper: {
	  flexDirection: 'row',
	  backgroundColor: CUSTOMCOLORS.offWhite,
	  paddingVertical: 10,
  },
  closeButton: {
    zIndex: 30,
	flex: 1,
	alignItems: 'center',
  },
  nextButton: {
	  zIndex: 30,
	  flex: 1,
	  alignItems: 'center',
  },
  nextButtonText: {
    color: CUSTOMCOLORS.lightPurple,
    fontSize: 18,
  },
  fullScreenImage: {
    width: Dimensions.get('window').width, // Full width of the screen
    height: Dimensions.get('window').height, // Full height of the screen
    resizeMode: 'contain', // Ensure content is scaled to fit
  },
});

export default CameraPage;
