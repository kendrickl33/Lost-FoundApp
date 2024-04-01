import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import {Slider} from '@miblanchard/react-native-slider';
import React, {useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {getUserByDocId, changeUsername} from '../../../services/firebaseService.js';
import { useFocusEffect } from '@react-navigation/native';
import {CUSTOMCOLORS} from '../../../constants/CustomColors';
import { useUser } from '../../../constants/UserContext';

export default function Settings() {
	const { user: currentUser } = useUser();
	const [searchSliderState, setSearchSliderState] = React.useState<number>(5);
	const [notifOpen, setNotifOpen] = React.useState(false);
	const [notifValue, setNotifValue] = React.useState('push');
	const [notifItems, setNotifItems] = React.useState([
		{label: 'Push', value: 'push'},
		{label: 'Email', value: 'email'},
		{label: 'Off', value: 'off'}
	]);	
	const [usernameState, setUsernameState] = React.useState();
	const [johnSmithsId, setJohnSmithsId] = React.useState('2j9pC69JqbZ0MqUyYCV6');

	/*
	const getUsername = async () => {
		//const docSnap = await getUserByDocId(currentUser?.id || johnSmithsId);
		setUsernameState(currentUser?.displayName || "");
	};
	*/
	useFocusEffect(
		React.useCallback(() => {
			setUsernameState("");
		}, [])
	);
	
	return (
		<View style={[styles.container, styles.testBorder]}>
			{/* Change username */}
			<View style={[styles.changeNameWrapper, styles.testBorder]}>
				<View style={[styles.changeNameLabel, styles.testBorder]}>
					<Text style={styles.text}>Username:</Text>
				</View>
				<View style={[styles.testBorder, styles.changeNameInput]}>
					<TextInput
						style={styles.text}
						onChangeText={setUsernameState}
						value={usernameState}
						selectionColor={colors.lightGray}
						cursorColor={CUSTOMCOLORS.lightPurple}
						placeholder="Username"
						placeholderTextColor={CUSTOMCOLORS.lightGray}
					/>
				</View>
				<TouchableOpacity style={[styles.changeNameButton, styles.testBorder]} onPress={async () => {await changeUsername(currentUser?.id || johnSmithsId, usernameState);}}>
					<Text style={[styles.text, styles.darkPurpleText]}>Change</Text>
				</TouchableOpacity>
			</View>
			{/* Search radius */}
			<View style={[styles.searchRadiusWrapper, styles.testBorder]}>
				<View style={[styles.searchRadiusLabel, styles.testBorder]}>
					<Text style={styles.text}>Search radius: {searchSliderState} mi</Text>
				</View>
				<View style={[styles.searchRadiusSlider, styles.testBorder]}>
					<Slider
						minimumValue = {5}
						value = {searchSliderState}
						step = {5}
						maximumValue = {50}
						onValueChange = {value => setSearchSliderState(value)}
						maximumTrackTintColor = {CUSTOMCOLORS.lightPurple}
						minimumTrackTintColor = {CUSTOMCOLORS.darkPurple}
						thumbTintColor = {CUSTOMCOLORS.darkPurple}
						itemSeparator = {true}
					/>
				</View>
			</View>
			{/* Notification method */}
			<View style={[styles.notifWrapper, styles.testBorder]}>
				<View style={styles.notifLabel}>
					<Text style={styles.text}>Notifications:</Text>
				</View>
				<View style={[styles.notifDropdownWrapper, styles.testBorder]} testID="dropdown">
					<DropDownPicker 
						style = {styles.notifDropdown} 
						labelStyle = {[styles.text, styles.darkPurpleText]}
						dropDownContainerStyle={styles.notifDropdown}
						listItemLabelStyle={[styles.text, styles.darkPurpleText]}

						arrowIconStyle={{tintColor: CUSTOMCOLORS.darkPurple}}
						tickIconStyle={{tintColor: CUSTOMCOLORS.darkPurple}}
												
						open={notifOpen}
						value={notifValue}
						items={notifItems}
						setOpen={setNotifOpen}
						setValue={setNotifValue}
					/>
				</View>
			</View>
		</View>
	);
}

const colors = {
	darkGray: '#3b3b3b',
	lightGray: '#cccccc',
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 10
	},
	text: {
		fontSize: 15,
		color: colors.darkGray,
	},
	darkPurpleText: {
		color: CUSTOMCOLORS.darkPurple,
	},
	testBorder: {
		borderWidth: 0,
		borderColor: 'red',
	},

	changeNameWrapper: {
		flexDirection: 'row',
		height: 50,
		margin: 10,
		alignItems: 'center',
	},
	changeNameLabel: {
		justifyContent: 'center',
	},
	changeNameInput: {
		flex: 1,
		height: 20,
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderColor: CUSTOMCOLORS.darkPurple,
		marginHorizontal: 10,
		marginTop: 4,
	},
	changeNameButton: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: CUSTOMCOLORS.veryLightPurple,
		borderRadius: 20,
		height: 40,
	},

	searchRadiusWrapper: {
		flexDirection: 'row',
		height: 50,
		margin: 10,
	},
	searchRadiusLabel: {
		flex: 2,
		justifyContent: 'center',
	},
	searchRadiusSlider:{
		flex: 1,
		justifyContent: 'center',
	},

	notifWrapper: {
		flexDirection: 'row',
		height: 50,
		margin: 10,
	},
	notifLabel: {
		flex: 1,
		justifyContent: 'center',
	},
	notifDropdownWrapper: {
		flex: 1,
		alignSelf: 'center',
	},
	notifDropdown: {
		backgroundColor: CUSTOMCOLORS.veryLightPurple,
		borderRadius: 20,
		minHeight: 40,
		borderWidth: 0,
	},
});
