const util = require('util');
const fetch = require('node-fetch');
const moment = require('moment');
const { verificarAlertsTypeS, verificarAlertsTypeM } = require('./AlertasController');

let items = [];
let alerts = [];

const saveToDB = (clientId, key, item) => {
    verifyItemsSize()
    // verifyAlertsSize();

    if(key.startsWith('S')) {
        if (item.H) {
            item.H = item.H.replace('.', '');
            const dbItem = {
                "cliente": clientId,
                "identificador": key,
                "fecha": moment(item.F, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                "hora": moment(item.H, 'HH:mm:ss A').format('HH:mm:ss'),
                "bateria": item.B || 0,
                "nivel": item.N || 0,
                "presion": item.P || 0,
                "g1": item.G1 || 0,
                "g2": item.G2 || 0,
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
            item.Hora = (item.Hora) ? item.Hora.replace('.', '') : '00:00:00';
            item.Fecha = (item.Fecha) ? item.Hora.replace('.', '') : '00:00:00';
            const dbItem = {
                "cliente": clientId,
                "identificador": key,
                "fecha": moment(item.Fecha, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                "hora": moment(item.Hora, 'HH:mm:ss A').format('HH:mm:ss'),
                "bateria": item.Bateria,
                "nivel": item.Nivel || 0,
                "presion": item.Presion || 0,
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

// SAVE ON TYPE S TABLE
const saveItemTypeS = (item) => {
    const inArray = containsObject(item, items);
    if (inArray) {        
        return;
    }

    verificarAlertsTypeS(item);
    
    try {
        const serverUrl = process.env.API_URL_TYPE_S;
        fetch(serverUrl, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        }).then(res => res.json())
          .catch(error => console.log('ERROR PARSING JSON', error.message))
          .then(resp => {
              if (!resp) {
                return;
              }
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

    verificarAlertsTypeM(item);

    try {
        const serverUrl = process.env.API_URL_TYPE_M;
        fetch(serverUrl, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        }).then(res => res.json())
          .catch(error => console.log('ERROR PARSING JSON', error.message))
          .then(resp => {
            if (!resp) {
                return;
            }
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
        const serverUrl = process.env.API_URL_TYPE_R;
        fetch(serverUrl, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        }).then(res => res.json())
          .catch(error => console.log('ERROR PARSING JSON', error.message))
          .then(resp => {
            if (!resp) {
                return;
            }
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
        const serverUrl = process.env.API_URL_TYPE_E;
        fetch(serverUrl, {
            method: 'POST',
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        }).then(res => res.json())
          .catch(error => console.log('ERROR PARSING JSON', error.message))
          .then(resp => {
            if (!resp) {
                return;
            }
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

const verifyItemsSize = () => {
    if(items.length >= 1000) {
        items = [];
    }
}

const verifyAlertsSize = () => {
    if(alerts.length >= 1000) {
        alerts = [];
    }
}

const pushInAlerts = (alert) => {
    alerts.push(alert);
}

module.exports = {
    saveToDB,
    sanitizate,
    pushInAlerts
}