import { auth, authdb } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

// Function to fetch user data from Firestore
export const fetchUserData = async (uid, setUser) => {
  const userDocRef = doc(authdb, "users", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    setUser({
      email: userData.Email,
      displayName: userData.Name,
      id: uid,
      icon: userData.media,
    });
  } else {
    console.log("No user found in Firestore with UID:", uid);
  }
};
