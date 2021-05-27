
const firebase = require('firebase');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBU6mTd1nZ3oYOSwPBr8gBl43Vy_TizYJY",
    authDomain: "fir-demo1-43831.firebaseapp.com",
    databaseURL: "https://fir-demo1-43831-default-rtdb.firebaseio.com",
    projectId: "fir-demo1-43831",
    storageBucket: "fir-demo1-43831.appspot.com",
    messagingSenderId: "954505889981",
    appId: "1:954505889981:web:cd7b64cd682fa11f578fd4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const firestore = firebase.firestore();
console.log('Se configuro firebase');

const getAllData = () => {
    database.ref().on('value', (snapshot)  => {
        const data = snapshot.val();
        // console.log( data );
        Object.keys(data).forEach((key, index) => {
            if (!key.endsWith(',') && (key.startsWith('S') || key.startsWith('M'))) {
               const item = data[key];
               Object.keys(item).forEach((value, i) => {
                   console.log(value, sanitizate(item[value]));
               });
               console.log('================');
            //    firestore.collection('Jerez').add(item);
            }
        });
    });
}

const sanitizate = (value) => {
    return value.toString().replace(/\"/g, "").replace(/\\/g, "");
}

module.exports = {
    database,
    firestore,
    sanitizate
}