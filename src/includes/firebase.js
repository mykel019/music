import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyB8vfKug_XuF3uHaLrbDT503SKNsOegTQ8",
  authDomain: "music-58dfb.firebaseapp.com",
  projectId: "music-58dfb",
  storageBucket: "music-58dfb.appspot.com",
  messagingSenderId: "243844740535",
  appId: "1:243844740535:web:1b51020332ccbaaebb2432"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const userCollection = db.collection('users');
const songCollection = db.collection('songs');
const commentsCollection = db.collection('comments');


export{
  auth, 
  db, 
  userCollection,
  songCollection,
  commentsCollection,
  storage
}