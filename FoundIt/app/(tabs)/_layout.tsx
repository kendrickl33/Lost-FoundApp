import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Post from './postfolder/post';
import { createNativeStackNavigator, CardStyleInterpolators } from '@react-navigation/native-stack';
import CameraPage from './postfolder/two';
import { Camera } from 'expo-camera';
import { UserProvider } from '../../constants/UserContext';
import { CUSTOMCOLORS } from '@/constants/CustomColors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();


	return (
    <UserProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={CUSTOMCOLORS.darkPurple} />,
            
          }}
        />
        <Tabs.Screen
          name="postfolder/post"
          options={{
            title: 'Post',
            tabBarIcon: ({ color }) => <AntDesign name="camerao" size={24} color={CUSTOMCOLORS.darkPurple} />,
            headerRight: () => (
              <Link href="/(tabs)/postfolder/post" asChild>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="postfolder/two"
          options={{
            title: "Post",
            href : null,
          }}
        />

        <Tabs.Screen
          name="account/profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={CUSTOMCOLORS.darkPurple} />,
            headerRight: () => (
              <Link href="/(tabs)/account/settings" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <AntDesign name="setting" size={24} color={CUSTOMCOLORS.darkPurple} style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}/>
                  )}
                </Pressable>
              </Link>
            ),
            headerLeft: () => (
              <Link href="/account/Login" asChild>
                <Pressable>
                  {({ pressed }) => (
					<View style={[styles.testBorder, styles.login]}>
						<Text style={[styles.text, styles.loginText]}>Login</Text>
					</View>
                  )}
                </Pressable>
				
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="account/settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => <AntDesign name="setting" size={24} color="black" />,
            href : null,
			headerLeft: () => (
              <Link href="/account/profile" asChild>
                <Pressable>
                  {({ pressed }) => (
					<Icon name="keyboard-backspace" size={30} color={CUSTOMCOLORS.darkPurple} style={[styles.backButton, {opacity: pressed ? 0.5 : 1 }]} />
                  )}
                </Pressable>
				
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="account/Login"
          options={{
            title: "Login",
            tabBarIcon: ({ color }) => <AntDesign name="login" size={24} color={color} />,
            href: null,
			headerLeft: () => (
              <Link href="/account/profile" asChild>
                <Pressable>
                  {({ pressed }) => (
					<Icon name="keyboard-backspace" size={30} color={CUSTOMCOLORS.darkPurple} style={[styles.backButton, {opacity: pressed ? 0.5 : 1 }]} />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="account/Forgot"
          options={{
            title: "Forgot Password",
            href: null,
			headerLeft: () => (
              <Link href="/account/Login" asChild>
                <Pressable>
                  {({ pressed }) => (
					<Icon name="keyboard-backspace" size={30} color={CUSTOMCOLORS.darkPurple} style={[styles.backButton, {opacity: pressed ? 0.5 : 1 }]} />
                  )}
                </Pressable>
				
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="account/Signup"
          options={{
            title: "Sign Up",
            href: null,
			headerLeft: () => (
              <Link href="/account/Login" asChild>
                <Pressable>
                  {({ pressed }) => (
					<Icon name="keyboard-backspace" size={30} color={CUSTOMCOLORS.darkPurple} style={[styles.backButton, {opacity: pressed ? 0.5 : 1 }]} />
                  )}
                </Pressable>
				
              </Link>
            ),
          }}
        />
      </Tabs>
    </UserProvider>
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
	text: {
		fontSize: 15,
		color: CUSTOMCOLORS.darkGray,
	},

	login: {
		borderRadius: 25,
		height: 40,
        alignItems: 'center',
        justifyContent: 'center',
		backgroundColor: CUSTOMCOLORS.veryLightPurple,
		paddingHorizontal: 15,
		marginLeft: 10,
	},
	loginText: {
		color: CUSTOMCOLORS.darkPurple,
		fontWeight: 'bold',
	},
	backButton: {
		marginLeft: 10,
	},
});
