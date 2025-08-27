import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRDXaS-91RQBf3Rd51hvB6JZBCMpaX58U",
  authDomain: "eemploy-task-manager.firebaseapp.com",
  projectId: "eemploy-task-manager",
  storageBucket: "eemploy-task-manager.firebasestorage.app",
  messagingSenderId: "172967398845",
  appId: "1:172967398845:web:0c1903f17df0c1d1da16d4",
  measurementId: "G-X9MFF16YF9"
}; 

firebase.initializeApp(firebaseConfig);
export default firebase;