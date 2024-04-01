import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../../constants/Colors_1";
import { Feather } from "@expo/vector-icons";
import { auth, authdb } from "../../../constants/firebaseConfig";
import { Entypo } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
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

export default function Login({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { setUser } = useUser();

  const handleSignin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      
      // Fetch user data from Firestore after login
      await fetchUserData(userCredential.user.uid, setUser);

      setLoading(false);
      alert("Login successfully to FoundIt!");
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        console.log(err);
      }
    }
  };

  return (
    <View style={[styles.testBorder, styles.container]}>
		{/*<Text style={[styles.testBorder, styles.loginHeaderText]}>Sign in to FoundIt</Text>*/}

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
			autoCapitalize="none"
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
			autoCapitalize="none"
        />

        {/* Forgot Password */}
        <View style={[styles.testBorder, styles.forgotContainer]}>
          <Link href="/account/Forgot" asChild>
            <TouchableOpacity>
              <Text style={[styles.testBorder, styles.linkText]}>Forgot Password?</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Login Button */}
        <TouchableOpacity onPress={handleSignin} style={[styles.testBorder, styles.loginButton]}>
            <Text style={[styles.testBorder, styles.loginButtonText]}>
				{loading ? "Loading" : "Login"}
            </Text>
        </TouchableOpacity>

        {/* Sign Up */}
        <View style={[styles.testBorder, styles.signupWrapper]}>
          <Text style={[styles.testBorder, styles.newHere]}>New here? </Text>
          <Link href="/account/Signup" asChild>
            <TouchableOpacity>
              <Text style={[styles.testBorder, styles.linkText]}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
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

  forgotContainer: {
	margin: 10,
	marginTop: 0,
    alignItems: "flex-end",
  },
  linkText: {
    fontSize: 15,
    color: CUSTOMCOLORS.darkPurple,
	fontWeight: 'bold',
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

  signupWrapper: {
    flexDirection: "row",
    margin: 10,
	marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  newHere: {
    fontSize: 15,
	color: CUSTOMCOLORS.darkGray,
  },
});
