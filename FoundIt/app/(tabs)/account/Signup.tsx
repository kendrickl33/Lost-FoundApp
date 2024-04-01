import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import React, { useState } from "react";
import Colors from "../../../constants/Colors_1";
import { Feather } from "@expo/vector-icons";
import { auth, authdb } from "../../../constants/firebaseConfig";
import { Entypo } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link } from 'expo-router';
import { useUser } from '../../../constants/UserContext';
import { fetchUserData } from '../../../constants/authService';
import {CUSTOMCOLORS} from '../../../constants/CustomColors'

const { width, height } = Dimensions.get("window");
let top;
if (Platform.OS === "ios") {
  top = height * 0.02;
} else {
  top = 0;
}

export default function Signup({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<any>("");
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<number | string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser } = useUser();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      await setDoc(doc(authdb, "users", user.uid), {
        Name: username,
        Email: email,
        PhoneNumber: phone,
        CreatedAt: new Date().toISOString(),
      });

      setUser({
        id: user.uid,
        displayName: username,
        email: email,
      });

      setLoading(false);
      alert("Account for FoundIt created successfully");
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        console.error('Error during sign up:', err);
        alert('An error occurred during sign up.');
      }
    }
  };

	return (
		<View style={[styles.testBorder, styles.container]}>		
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Username */}
				<Text style={[styles.testBorder, styles.inputHeader]}>Username</Text>
				<TextInput
					style={[styles.testBorder, styles.text, styles.input]}
					placeholder="Username"
					value={username}
					onChangeText={(text) => setUsername(text)}
					placeholderTextColor={CUSTOMCOLORS.lightGray}
					cursorColor={CUSTOMCOLORS.lightPurple}
					selectionColor={CUSTOMCOLORS.lightPurple}
				/>

				{/* Email */}
				<Text style={[styles.testBorder, styles.inputHeader]}>Email</Text>
				<TextInput
					style={[styles.testBorder, styles.text, styles.input]}
					placeholder="Email"
					value={email}
					onChangeText={(text) => setEmail(text)}
					placeholderTextColor={CUSTOMCOLORS.lightGray}
					cursorColor={CUSTOMCOLORS.lightPurple}
					selectionColor={CUSTOMCOLORS.lightPurple}
				/>

				{/* Phone Number */}
				<Text style={[styles.testBorder, styles.inputHeader]}>Phone number</Text>
				<TextInput
					style={[styles.testBorder, styles.text, styles.input]}
					placeholder="Phone number"
					value={phone?.toString()}
					keyboardType="numeric"
					onChangeText={(text) => setPhone(text)}
					placeholderTextColor={CUSTOMCOLORS.lightGray}
					cursorColor={CUSTOMCOLORS.lightPurple}
					selectionColor={CUSTOMCOLORS.lightPurple}
				/>

				{/* Password */}
				<Text style={[styles.testBorder, styles.inputHeader]}>Password</Text>
				<TextInput
					style={[styles.testBorder, styles.text, styles.input]}
					placeholder="Password"
					value={password}
					secureTextEntry={true}
					onChangeText={(text) => setPassword(text)}
					placeholderTextColor={CUSTOMCOLORS.lightGray}
					cursorColor={CUSTOMCOLORS.lightPurple}
					selectionColor={CUSTOMCOLORS.lightPurple}
				/>

				{/* Login Button */}
				<TouchableOpacity onPress={handleSignup} style={[styles.testBorder, styles.loginButton]}>
					<Text style={[styles.testBorder, styles.loginButtonText]}>
						{loading ? "Creating account..." : "Create Account"}
					</Text>
				</TouchableOpacity>

				{/*
				<View style={styles.signupGroup}>
				  <Text style={styles.new}>Already have an account?</Text>
				  <Link href="/account/Login" asChild>
					<TouchableOpacity>
					  <Text style={styles.signup}>Login</Text>
					</TouchableOpacity>
				  </Link>
				</View>
				*/}
			</ScrollView>
		</View>
  );
}

const styles = StyleSheet.create({
  	container: {
		flex: 1,
		padding: 10,
		backgroundColor: CUSTOMCOLORS.offWhite,		
	},
	testBorder: {
		borderWidth: 0,
		borderColor: 'red',
	},
	text: {
        fontSize: 15,
        color: CUSTOMCOLORS.darkGray,
    },
  
	inputHeader: {
		fontSize: 20,
		color: CUSTOMCOLORS.darkGray,
		fontWeight: "bold",
		margin: 10,
		marginBottom: 0,
	},
	input: {
		margin: 10,
		height: 50,
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: CUSTOMCOLORS.lightPurple,
		borderRadius: 10,
		paddingHorizontal: 10,
	},

	loginButton: {
		margin: 10,
		marginTop: 20,
		height: 50,
		backgroundColor: CUSTOMCOLORS.darkPurple,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
	},
	loginButtonText: {
		fontSize: 15,
		fontWeight: "bold",
		color: CUSTOMCOLORS.veryLightPurple,
	},
});
