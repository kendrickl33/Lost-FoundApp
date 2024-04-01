// firebaseService.js
import db from '../constants/firebaseConfig'; // import the Firestore instance from your config file
import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc} from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { NativeModules } from 'react-native';


const addUserData = (userId) => {
  return db.collection('users').add(userId);
};

const getUserId = async (name) => {
  const users = db.collection("users");
  const specificUser = await users.where("Name", "==", name).get();
  specificUser.forEach(doc => {
    userId = doc.id;
  });
  return userId;
};

const getUserData = async (name) => {
  const users = db.collection("users");
  const specificUser = await users.where("Name", "==", name).get();
  specificUser.forEach(doc => {
    user = doc.data();
    user.id = doc.id
  })
  return user;
};

const getUserByDocId = async (docId) => {
	const docRef = doc(db, "users", docId);
	const docSnap = await getDoc(docRef);
	return docSnap;
};

const changeUsername = async (docId, usernameState) =>
{
	const docRef = doc(db, "users", docId);
	await updateDoc(docRef, {
		Name: usernameState,
	});
};

const addPost = async (userId, username, postData) => {
  try {
    // Assuming `posts` is a top-level collection
    const postRef = await addDoc(collection(db, "posts"), {
      ...postData,
      userId,
      username,
      postTime: new Date(), // Firestore timestamp for the post creation time
    });
    return postRef;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Error adding post to Firestore");
  }
};


async function getPosts(content) {
  const results = [];
  const contentLower = content.toLowerCase();

  if (content === "") {
      const defaultSearch = await db.collection("posts").get();
      defaultSearch.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          results.push(data);
      });
  } else {
      // Search by title and tags using case-insensitive queries
      const byId = db.collection("posts").where("userId", "==", content);
      const byTag = db.collection("posts").where("tags", "array-contains", contentLower);

      const [snapshot1, snapshot2] = await Promise.all([byId.get(), byTag.get()]);

      snapshot1.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          results.push(data);
      });

      snapshot2.forEach(doc => {
          if (!results.some(result => result.id === doc.id)) {
              const data = doc.data();
              data.id = doc.id;
              results.push(data);
          }
      });
  }
  return results;
};

const uploadMediaAsync = async (uris) => {
  console.log("Uploading media URIs:", uris);
  const storage = getStorage();
  const urls = [];
  try {
    for (const uri of uris) {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `media/${Date.now()}-${uri.split('/').pop()}`;
      const ref = storageRef(storage, fileName);
      const snapshot = await uploadBytes(ref, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      urls.push(downloadURL);
    }
    return urls;
  } catch (error) {
    console.error("Error uploading media:", error);
    throw new Error("Failed to upload media");
  }
};

export { addUserData, getUserData , getPosts, addPost, uploadMediaAsync, getUserByDocId, changeUsername, getUserId};

