const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase)

const db = admin.firestore();

exports.scheduledFunction = functions.pubsub.schedule('every 2 minutes').onRun((context) => {
  const blockchain = db.collection("blockchain");
  blockchain.doc("block").get()
    .then((doc) => {
      blockchain.doc("block").set({
        height: doc.data().height + 1,
        timestamp: Date.now()
      })
    })
    .catch((err) => {
      console.log(err);
    });
  console.log('This will be run every 1 minutes!',context);
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
