const firebase = require('firebase');
const { getTanqueById, getSensorById, getPozoById } = require('../controllers/DataController');
const { saveToDB, sanitizate } = require('../controllers/DBController');
const moment = require('moment');
const util = require('util');

let fireBaseItems = [];

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

const getFirebaseData = async () => {    
    database.ref().on('value', (snapshot)  => {
        const data = snapshot.val();
        // console.log('data:', data);
        Object.keys(data).forEach(async (key, index) => {
            if (!key.endsWith(',') && (key.startsWith('S') || key.startsWith('M') || key === 'R1010' || key === 'E1010')) {
                const item = data[key];
                const newItem = {};
                Object.keys(item).forEach((value, i) => {
                    newItem[value] = sanitizate(item[value]);
                });

                if (fireBaseItems.length >= 1000) {
                    fireBaseItems = [];
                }
                let clientId = await getDeviceClient(key, newItem);
                // console.log('Cliente ID:', clientId);
                saveToFirestore(clientId, key, newItem);
                saveToDB(clientId, key, newItem);
            }
        });
    });
}

const getDeviceClient = async (key, newItem) => {
    let device = null;
    let clientId = 'DFTCO';

    try {
        if (key.startsWith('S') && newItem['Tipo']){
            const tipo = newItem['Tipo'].toLowerCase();
            if (tipo.includes('tanque')) {
                device = await getTanqueById(key);
            } else {
                device = await getSensorById(key);
            }
        } else if (key.startsWith('M')) {
            device = await getPozoById(key);
        } else {
            clientId = 'Cargadero';
        }

        if (device) {
            clientId = device.cliente;
        }
        return clientId;
    } catch (error) {
        // console.log('ERROR', error);
        return clientId;
    }
}

const saveToFirestore = (clientid, key, item) => {
    const compare = { id: key };
    const newItem = Object.assign({}, item);
    let fecha = null;
    if (item.F) {
        fecha = moment(`${item.F} ${item.H}`, 'MM/DD/YYYY HH:mm:ss A');
        newItem.F2 = (fecha.unix())*1000;
        compare.date = `${item.F} ${item.H}`;
    } else {
        fecha = moment(`${item.Fecha} ${item.Hora}`, 'MM/DD/YYYY HH:mm:ss A');
        newItem.Fecha2 = (fecha.unix())*1000;
        compare.date = `${item.Fecha} ${item.Hora}`;
    }

    const inArray = containsObject(compare, fireBaseItems);
    if (inArray) {
        return;
    }

    try {
        firestore.collection(clientid)
            .doc('data')
            .collection(key)
            .add(newItem)
            .then(resp => {
                fireBaseItems.push(compare);
                console.log('Se guardo en firebase', key);
            })
            .catch(e => console.log(e));
    } catch (error) {
        console.log(error);
    }
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
    getFirebaseData
}
