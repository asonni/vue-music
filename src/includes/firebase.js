import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDJzr5h7lKzDCZqCaNkU_qQuDteHHHrrFc',
  authDomain: 'vue3-music.firebaseapp.com',
  projectId: 'vue3-music',
  storageBucket: 'vue3-music.appspot.com',
  messagingSenderId: '72609733188',
  appId: '1:72609733188:web:5f33454c734489ade5fa11'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch(error => {
  console.error(`Firebase persistence error ${error.code}`);
});

const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentsCollection = db.collection('comments');

export {
  db,
  auth,
  storage,
  usersCollection,
  songsCollection,
  commentsCollection
};
