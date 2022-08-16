import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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

const usersCollection = db.collection('users');

export { auth, db, usersCollection };
