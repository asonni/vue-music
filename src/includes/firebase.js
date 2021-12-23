import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDJzr5h7lKzDCZqCaNkU_qQuDteHHHrrFc',
  authDomain: 'vue3-music.firebaseapp.com',
  projectId: 'vue3-music',
  storageBucket: 'vue3-music.appspot.com',
  appId: '1:72609733188:web:5f33454c734489ade5fa11'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const usersCollection = db.collection('users');

export { auth, db, usersCollection };
