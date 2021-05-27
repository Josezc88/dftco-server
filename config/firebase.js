
const firebase = require('firebase');
const util = require('util');

const items = [];
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

const getFirebaseData = () => {
    database.ref().on('value', (snapshot)  => {
        const data = snapshot.val();
        Object.keys(data).forEach((key, index) => {
            if (!key.endsWith(',') && (key.startsWith('S') || key.startsWith('M') || key === 'R1010' || key === 'E1010')) {
                const item = data[key];
                const newItem = {};
                Object.keys(item).forEach((value, i) => {
                    newItem[value] = sanitizate(item[value]);
                });

                const clientId = (key === 'R1010' || key === 'E1010') ? 'Cargadero' : 'Jerez';
                saveToFirestore(clientId, key, newItem);
            }
        });
    });
}

const saveToFirestore = (clientid, key, item) => {
    const inArray = containsObject(item, items);
    if (inArray) {        
        return;
    }
    
    firestore.collection(clientid)
        .doc('data')
        .collection(key)
        .add(item)
        .then(resp => {
            items.push(item);
        })
        .catch(e => console.log(e));
}

const sanitizate = (value) => {
    return value.toString().replace(/\"/g, "").replace(/\\/g, "");
}

const containsObject = (obj, list) => {
    var i;
    for (i = 0; i < list.length; i++) {
        const result = util.isDeepStrictEqual(list[i], obj);
        if (result) {
            return true;
        }
    }

    return false;
}

module.exports = {
    // database,
    // firestore,
    // sanitizate,
    getFirebaseData
}