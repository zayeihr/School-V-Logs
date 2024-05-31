
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import { Timestamp } from 'firebase/compat/firestore'



const firebaseConfig = {
    apiKey: "AIzaSyBaM1tYHIUY4kDPBHPWCzMzPvr9QZ1X2T8",
    authDomain: "hq-store-18fb9.firebaseapp.com",
    projectId: "hq-store-18fb9",
    storageBucket: "hq-store-18fb9.appspot.com",
    messagingSenderId: "1085448679823",
    appId: "1:1085448679823:web:0977c2e7dbd9b9c9bf9bfa",
    measurementId: "G-TJDFNNBEES"
  };
  firebase.initializeApp(firebaseConfig);
  //Initialise Firestore Database
  export const db = firebase.firestore();
  export const auth = firebase.auth();
  export const user = auth.currentUser;
  
  



