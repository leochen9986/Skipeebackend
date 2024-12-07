import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC5mnFyx_YD-QuB47ISw82lNt4Cbx2pkoA',
  authDomain: 'skipee-ba66f.firebaseapp.com',
  projectId: 'skipee-ba66f',
  storageBucket: 'skipee-ba66f.appspot.com',
  messagingSenderId: '930105587541',
  appId: '1:930105587541:web:0ae18859a4c78e9195e1dc',
  measurementId: 'G-8VQ0H6C1KQ',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get Storage reference
const firebaseStorage = getStorage(firebaseApp);

export { firebaseApp, firebaseStorage };
