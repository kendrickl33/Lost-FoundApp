import React, { useState, useEffect, useLayoutEffect, useId } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, Image, View, Text, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getLocation } from './locationUtil';
import {getUserId, addUserData, getUserData , getPosts, addPost, uploadMediaAsync} from '../../../services/firebaseService.js'
import {CUSTOMCOLORS} from '../../../constants/CustomColors'
import { useUser } from '../../../constants/UserContext';

export default function Post() {
    const navigation = useNavigation();
    const [uploading, setUploading] = useState(false);
    const route = useRoute();

    const media = route.params?.media;
    const mediaArray = media || [];

    const [tags, setTags] = useState('');


    const [title, setTitle] = useState('');
	const { user: currentUser, setUser: setCurrentUser } = useUser();
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState('');
    const [lostFound, setLostFound] = useState('lost');
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    

    useEffect(() => {
        if (route.params?.selectedLocation) {
          setLocation(route.params.selectedLocation);
        }
        console.log("Selected media:", mediaArray);
      }, [route.params, mediaArray]);

    const handleAddLocation = () => {
        navigation.navigate('modal');
      };

      const handleSubmit = async () => {
        setUploading(true);
        try {
            const mediaUrls = await uploadMediaAsync(mediaArray.map(media => media.uri));
            const userId = currentUser?.id || '0';
			const username = currentUser?.displayName || 'Guest User';

            // Ensure tags are trimmed, non-empty, and converted to lowercase
            const tagArray = tags.split(',')
                                 .map(tag => tag.trim().toLowerCase())
                                 .filter(tag => tag.length > 0);

            const postData = {
                title: title,
                description: description,
                reward: reward,
                lostFound: lostFound,
                location: location,
                media: mediaUrls,
                tags: tagArray, // Tags are now prepared for case-insensitive search
            };

            const postRef = await addPost(userId, username, postData);
            console.log('Post added with ID:', postRef.id);
            // Handle successful post submission
        } catch (error) {
            console.error('Failed to submit post:', error);
            // Handle submission errors
        } finally {
            setUploading(false);
            navigation.goBack();
        }
    };

    return (
        <View style={[styles.container, styles.testBorder]}>
			<ScrollView>
				<TextInput
					style={[styles.testBorder, styles.title]}
					onChangeText={setTitle}
					value={title}
					placeholder="Title"
					placeholderTextColor={CUSTOMCOLORS.lightGray}
					cursorColor={CUSTOMCOLORS.lightPurple}
					selectionColor={CUSTOMCOLORS.lightPurple}
				/>

				
				<View style={[styles.testBorder, styles.lostFoundWrapper]}>
					<TouchableOpacity
						style={[styles.lostFoundButton, lostFound === 'lost' ? styles.lostFoundButtonSelected : styles.lostFoundButton]}
						onPress={() => setLostFound('lost')}>
						<Text style={styles.darkPurpleText}>Lost</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.lostFoundButton, lostFound === 'lost' ? styles.lostFoundButton : styles.lostFoundButtonSelected]}
						onPress={() => setLostFound('found')}>
						<Text style={styles.darkPurpleText}>Found</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.divider}></View>

				{/* Additional photo upload and location indication */}
				<TouchableOpacity style={[styles.testBorder, styles.additionalButton]} onPress={() => {navigation.navigate('postfolder/two');}}>
					<Icon name="camera-plus" size={25} color={CUSTOMCOLORS.darkPurple} />
					<Text style={styles.darkPurpleText}> Add Media</Text>
				</TouchableOpacity>

				{/* Media preview */}
				{mediaArray.map((item: { type: string; uri: any; }, index: React.Key | null | undefined) => (
					item.type === 'image' ? (
						<View style={[styles.testBorder, styles.mediaPreviewWrapper]}>
							<Image key={index} source={{ uri: item.uri }} style={styles.mediaPreview} resizeMode="cover"/>
						</View>
					) : (
						<View style={[styles.testBorder, styles.mediaPreviewWrapper]}>
							<Video key={index} source={{ uri: item.uri }} style={styles.mediaPreview} useNativeControls resizeMode="cover" isLooping />
						</View>
					)
				))}

				<TouchableOpacity style={[styles.testBorder, styles.additionalButton]} onPress={handleAddLocation}>
					<Icon name="map-marker" size={25} color={CUSTOMCOLORS.darkPurple} />
					<Text style={styles.darkPurpleText}> Add Location</Text>
				</TouchableOpacity>

				{/* Display the selected location */}
				{location && (
					<View style={[styles.testBorder, styles.locationDisplay]}>
						<Text style={styles.locationText}>Latitude: {location.latitude}</Text>
						<Text style={styles.locationText}>Longitude: {location.longitude}</Text>
					</View>
				)}

				<View style={styles.divider}></View>

				{lostFound === 'found' && (
					<Text style={[styles.testBorder, styles.tipText]}>
						Tip: Leave out one identifying detail about the item so you can ask a claimant about it to confirm it is really theirs.
					</Text>
				)}

				<View style={[styles.testBorder, styles.descriptionScrollView]}>
					<TextInput
						style={[styles.testBorder, styles.description]}
						onChangeText={setDescription}
						value={description}
						placeholder="Description"
						placeholderTextColor={CUSTOMCOLORS.lightGray}
						multiline={true}
						cursorColor={CUSTOMCOLORS.lightPurple}
						selectionColor={CUSTOMCOLORS.lightPurple}
					/>
				</View>

				<TextInput
					style={[styles.testBorder, styles.tagInput]}
					onChangeText={setTags}
					value={tags}
					placeholder="Enter tags (comma-separated)"
					placeholderTextColor={CUSTOMCOLORS.lightGray}
					cursorColor={CUSTOMCOLORS.lightPurple}
					selectionColor={CUSTOMCOLORS.lightPurple}
				/>

				{lostFound === 'lost' && (
					<View style={[styles.testBorder, styles.rewardWrapper]}>
						<Text style={[styles.text, { alignSelf: 'center' }]}>Reward: $</Text>
						<TextInput
							style={styles.reward}
							onChangeText={setReward}
							value={reward}
							placeholder='0'
							placeholderTextColor={CUSTOMCOLORS.lightGray}
							keyboardType='numeric'
							cursorColor={CUSTOMCOLORS.lightPurple}
							selectionColor={CUSTOMCOLORS.lightPurple}
						/>
					</View>
				)}

				<TouchableOpacity style={[styles.testBorder, styles.post]} onPress={handleSubmit}>
					<Text style={[styles.text, styles.postText]}>Post</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
    );
}

// Assuming colors are defined within this component, else import from a separate file
const colors = {
    darkGray: '#3b3b3b',
    lightGray: '#cccccc',
    blue: '#0000FF',
};

// Updated styles based on the suggestions
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
	text: {
        fontSize: 15,
        color: CUSTOMCOLORS.darkGray,
    },
	darkPurpleText: {
		fontSize: 15,
		color: CUSTOMCOLORS.darkPurple,
	},
	divider: {
		borderBottomWidth: 1,
		borderColor: CUSTOMCOLORS.lightPurple,
		marginVertical: 10,
	},
    
    title: {
        fontSize: 20,
        color: CUSTOMCOLORS.darkGray,
		margin: 10,
		fontWeight: 'bold',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderColor: CUSTOMCOLORS.darkPurple,
		height: 40,
    },

	lostFoundWrapper: {
        flexDirection: 'row',
		marginBottom: 10,
    },
    lostFoundButton: {
        flex: 1,
		height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: CUSTOMCOLORS.lightPurple,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    lostFoundButtonSelected: {
        backgroundColor: CUSTOMCOLORS.veryLightPurple,
        borderColor: 'transparent',
    },

    additionalButton: {
        flexDirection: 'row',
        alignItems: 'center',
		margin: 10,
		height: 40,
		backgroundColor: CUSTOMCOLORS.veryLightPurple,
		borderRadius: 20,
		paddingHorizontal: 10,
    },
	mediaPreviewWrapper: {
        margin: 10,
	},
	mediaPreview: {
        width: 'auto',
        //height: Dimensions.get('window').width * (3/4),
		height: undefined,
		aspectRatio: 1,
		borderRadius: 10,
    },

    locationDisplay: {
        margin: 10,
		marginTop: 0,
    },
    locationText: {
        fontSize: 13,
        color: CUSTOMCOLORS.lightGray,
    },

    tipText: {
        fontSize: 14,
        color: CUSTOMCOLORS.lightGray,
        fontStyle: 'italic',
		margin: 10,
		marginBottom: 0,
    },
    
    descriptionScrollView: {
        maxHeight: 200,
		margin: 10,
    },
    description: {
        fontSize: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
		borderWidth: 1,
		borderColor: CUSTOMCOLORS.lightPurple,
		color: CUSTOMCOLORS.darkGray,
		padding: 10,
    },

	tagInput: {
		fontSize: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
		borderWidth: 1,
		borderColor: CUSTOMCOLORS.lightPurple,
		color: CUSTOMCOLORS.darkGray,
		margin: 10,
		height: 50,
		paddingHorizontal: 10,
    },

    rewardWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
		margin: 10,
    },
    reward: {
        fontSize: 15,
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginLeft: 10,
		color: CUSTOMCOLORS.darkGray,
		borderWidth: 1,
		borderColor: CUSTOMCOLORS.lightPurple,
		height: 50,
		paddingHorizontal: 10,
    },

    post: {
        borderRadius: 25,
		height: 50,
        alignItems: 'center',
        justifyContent: 'center',
		margin: 10,
		backgroundColor: CUSTOMCOLORS.darkPurple,
    },
	postText: {
		color: CUSTOMCOLORS.veryLightPurple,
		fontWeight: 'bold',	
	}
});
