
const firebase = require('firebase');
const util = require('util');
const fetch = require('node-fetch');
const moment = require('moment');

let fireBaseItems = [];
let items = [];

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

                if (items.length >= 1000) {
                    items = [];
                }

                if (fireBaseItems.length >= 1000) {
                    fireBaseItems = [];
                }

                const clientId = (key === 'R1010' || key === 'E1010') ? 'Cargadero' : 'Jerez';
                // saveToFirestore(clientId, key, newItem);
                saveToDB(clientId, key, newItem);
            }
        });
    });
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
    // console.log('inArray', inArray);
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

const saveToDB = (clientId, key, item) => {
    if(key.startsWith('S')) {
        if (item.H) {
            item.H = item.H.replace('.', '');
            const dbItem = {
                "cliente": clientId,
                "identificador": key,
                "fecha": moment(item.F, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                "hora": moment(item.H, 'HH:mm:ss A').format('HH:mm:ss'),
                "bateria": item.B,
                "nivel": item.N,
                "presion": item.P,
                "g1": item.G1,
                "g2": item.G2,
                "f1": item.Flot1 || 0,
                "f2": item.Flot2 || 0,
                "a": item.A || 0,
                "c": item.C || 0,
                "max": item.Max || 0,
                "min": item.Min || 0,
                "maxMin": item.MaxMin || '',
                "nombre": item.Nombre || '',
                "tipo": item.Tipo || ''
            };
            saveItemTypeS(dbItem);
        } else {
            console.log(item);
            item.Hora= item.Hora.replace('.', '');
            const dbItem = {
                "cliente": clientId,
                "identificador": key,
                "fecha": moment(item.Fecha, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                "hora": moment(item.Hora, 'HH:mm:ss A').format('HH:mm:ss'),
                "bateria": item.Bateria,
                "nivel": item.Nivel,
                "presion": item.Presion,
                "g1": 0,
                "g2": 0,
                "f1": item.Flot1 || 0,
                "f2": item.Flot2 || 0,
                "a": item.A || 0,
                "c": item.C || 0,
                "max": item.Max || 0,
                "min": item.Min || 0,
                "maxMin": item.MaxMin || '',
                "nombre": item.Nombre || '',
                "tipo": item.Tipo || ''
            };
            saveItemTypeS(dbItem);
        }
    } else if(key.startsWith('M')) {
        item.Hora= item.Hora.replace('.', '');
        const dbItem = {
            "cliente": clientId,
            "identificador": key,
            "fecha": moment(item.Fecha, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            "forzarbomba": item.ForzarBomba,
            "hora": moment(item.Hora, 'HH:mm:ss A').format('HH:mm:ss'),
            "maa4": item.MAA4,
            "maa5": item.MAA5,
            "maa6": item.MAA6,
            "mfoff": item.MFOff,
            "mfon": item.MFOn,
            "msenal": item.MSenal,
            "mva1": item.MVA1,
            "mva2": item.MVA2,
            "mva3": item.MVA3,
            "mreadnivel": item.MreadNivel,
            "mreadpresion": item.MreadPresion,
            "relebomba": item.ReleBomba,
            "relefoff": item.ReleFOff,
            "relefon": item.ReleFOn,
            "relesenal": item.ReleSenal
        };
        saveItemTypeM(dbItem);
    } else if (key.startsWith('R')) {
        item.Hora= item.Hora.replace('.', '');
        const dbItem = {
            "cliente": clientId,
            "identificador": key,
            "a5": item.A5,
            "a6": item.A6,
            "a7": item.A7,
            "a8analog": item.A8analog,
            "bomba": item.Bomba,
            "foff": item.FOff,
            "fon": item.FOn,
            "fecha": moment(item.Fecha, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            "flotador": item.Flotador,
            "hora": moment(item.Hora, 'HH:mm:ss A').format('HH:mm:ss'),
            "relebomba": item.ReleBomba,
            "relefoff": item.ReleFOff,
            "relefon": item.ReleFOn,
            "relesenal": item.ReleSeñal,
            "senal": item.Señal
        };
        saveItemTypeR(dbItem);
    } else if (key.startsWith('E')) {
        item.Hora= item.Hora.replace('.', '');
        const dbItem = {
            "cliente": clientId,
            "identificador": key,
            "bateria": item.Bateria,
            "fecha": moment(item.Fecha, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            "flotador": item.Flotador,
            "hora": moment(item.Hora, 'HH:mm:ss A').format('HH:mm:ss')
        };
        saveItemTypeE(dbItem);
    }
}
// 
const saveItemTypeS = (item) => {
    const inArray = containsObject(item, items);
    if (inArray) {        
        return;
    }
    
    try {
        const serverUrl = 'http://dftco.com.mx/api/v1/tipoS/create';
        fetch(serverUrl, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        }).then(res => res.json())
          .then(resp => {
            if (resp.ok) {
                console.log('Se guardo correctamente', item.identificador);
                items.push(item);
            } else {
                console.error('NO SE GUARDO', resp);
            }
          })
          .catch((e) =>{
              console.log(e);
          })
    } catch (error) {
        console.log('ERROR', error);
    }
}

const saveItemTypeM = (item) => {
    const inArray = containsObject(item, items);
    if (inArray) {        
        return;
    }

    try {
        const serverUrl = 'http://dftco.com.mx/api/v1/tipoM/create';
        fetch(serverUrl, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        }).then(res => res.json())
          .then(resp => {
            if (resp.ok) {
                console.log('Se guardo correctamente', item.identificador);
                items.push(item);
            }
          });
    } catch (error) {
        console.log('ERROR', error);
    }
}

const saveItemTypeR = (item) => {
    const inArray = containsObject(item, items);
    if (inArray) {        
        return;
    }

    try {
        const serverUrl = 'http://dftco.com.mx/api/v1/tipoR/create';
        fetch(serverUrl, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        }).then(res => res.json())
          .then(resp => {
            if (resp.ok) {
                console.log('Se guardo correctamente', item.identificador);
                items.push(item);
            }
          });
    } catch (error) {
        console.log('ERROR', error);
    }
}

const saveItemTypeE = (item) => {
    const inArray = containsObject(item, items);
    if (inArray) {        
        return;
    }

    try {
        const serverUrl = 'http://dftco.com.mx/api/v1/tipoE/create';
        fetch(serverUrl, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        }).then(res => res.json())
          .then(resp => {
            if (resp.ok) {
                console.log('Se guardo correctamente', item.identificador);
                items.push(item);
            }
          });
    } catch (error) {
        console.log('ERROR', error);
    }
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
