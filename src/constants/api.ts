import firebase from './firebase';
import "firebase/firestore";

const db = firebase.firestore();

export const users = db.collection("users");
export const blocks = db.collection("blockchain").doc("block");
export const tokens = db.collection("tokens");
export const missions = db.collection("missions");
export const domains = db.collection("domains");
export const model = db.collection("model").doc("map");

// export const GET_TEST_ASSETS = 'testgame_getResource';
// export const GET_TIMETX_ASSETS = 'timetx_getResource'
//
// export const getTestAssets = firebase.functions().httpsCallable(GET_TEST_ASSETS);
// export const getTimetxAssets = firebase.functions().httpsCallable(GET_TIMETX_ASSETS);