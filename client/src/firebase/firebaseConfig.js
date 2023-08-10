import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/database"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6HKrm3gj7R5Dn9nLTciEEkmuK6bbQlj4",
  authDomain: "stripe-subscribtion-app.firebaseapp.com",
  projectId: "stripe-subscribtion-app",
  storageBucket: "stripe-subscribtion-app.appspot.com",
  messagingSenderId: "850099477887",
  appId: "1:850099477887:web:c14fa3c7856e168235ce4a"
};


if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export default firebase