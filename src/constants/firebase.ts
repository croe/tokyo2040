import * as firebase from 'firebase/app';
import 'firebase/auth'

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "tokyo-2040.firebaseapp.com",
  databaseURL: "https://tokyo-2040.firebaseio.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  projectId: "tokyo-2040",
  storageBucket: "tokyo-2040.appspot.com"
};

firebase.initializeApp(config)

export default firebase