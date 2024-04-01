import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../../constants/Colors_1";
import { auth, authdb } from "../../../constants/firebaseConfig";
import { Feather } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import {CUSTOMCOLORS} from '../../../constants/CustomColors'

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");

  const handlePassword = async () => {
    await sendPasswordResetEmail(auth, email)
      .then(() => alert("Password reset email sent"))
      .catch((error: any) => console.log(error.message));
  };
  return (
    <View style={[styles.testBorder, styles.container]}>
      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
		<Image
          source={require("../../../assets/images/forgot.png")}
          style={[styles.testBorder, styles.mediaPreview]}
		  resizeMode="contain"
        />

        <Text style={[styles.testBorder, styles.forgotHeader]}>Forgot your password?</Text>
        <TextInput
            style={[styles.testBorder, styles.text, styles.input]}
            placeholder="Email"
            autoCapitalize="none"
			autoCorrect={false}
            secureTextEntry={false}
            value={email}
            onChangeText={(text) => setEmail(text)}
			placeholderTextColor={CUSTOMCOLORS.lightGray}
			cursorColor={CUSTOMCOLORS.lightPurple}
			selectionColor={CUSTOMCOLORS.lightPurple}
        />

		<TouchableOpacity onPress={handlePassword} style={[styles.testBorder, styles.loginButton]}>
            <Text style={[styles.testBorder, styles.loginButtonText]}>
				Send password reset link
            </Text>
        </TouchableOpacity>


        <Text style={[styles.testBorder, styles.tipText]}>
            Tip: If you don't see the email, try checking your spam folder.
        </Text>
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

	mediaPreview: {
		width: 'auto',
		//height: Dimensions.get('window').width * (3/4),
		height: undefined,
		aspectRatio: (330/220),
	},

	forgotHeader: {
		fontSize: 20,
		fontWeight: "bold",
		color: CUSTOMCOLORS.darkGray,
		fontWeight: "bold",
		margin: 10,
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

	tipText: {
        fontSize: 14,
        color: CUSTOMCOLORS.lightGray,
        fontStyle: 'italic',
		margin: 10,
		marginTop: 0,
    },

  emailContainer: {
    marginTop: 15,
    width: "100%",
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  
  buttonContainer: {
    marginTop: "5%",
    width: "100%",
    height: 50,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    color: Colors.white,
    fontSize: 18,
  },
  send: {
    color: Colors.white,
    fontSize: 18,
  },
  
  
  formContainer: {
    width: "100%",
  },
});
