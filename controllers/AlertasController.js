const util = require('util');
const fetch = require('node-fetch');
const { getTanqueById, getSensorById, getPozoById } = require('./DataController');
const { saveAlert } = require('./DBController');

const getDevices = async() => {
    tanques = await getTanques();
    pozos = await getPozos();
    sensores = await getSensores();
    console.log('GETTING DEVICES DONE!');
}

const verificarAlertsTypeS = async (item) => {
    // console.log('PROCESSING DATA FOR TYPE S');
    let device = await getDeviceSById(item.identificador, item.tipo);
    if (device) {
        if (device.alertas.length > 0) {
            let alerts = device.alertas;
            let aux = parseFloat(item.presion) - parseFloat(item.min);
            let capacidad = Math.round((aux*100) / (parseFloat(item.max) - parseFloat(item.min)));
            let limitDown = alerts[0].valor;
            let limitMiddle = alerts[1].valor;
            let limitUp = alerts[2].valor;

            let newAlert = {
                tipo: '',
                dispositivo: item.identificador,
                fecha: item.fecha,
                hora: item.hora,
                valor: capacidad,
                observaciones: '',
                estado: 'Activa',
                nivel: 'N/A'
            };
            
            if (capacidad >= limitDown && capacidad < limitMiddle) {
                newAlert.tipo = alerts[0].nombre;
                newAlert.nivel = 'Baja';
                if (alerts[0].estado) {
                    try {
                        saveAlert(newAlert);
                    } catch (error) {
                        console.log('ERROR EN SAVE ALERT:', error);
                    }
                }
            } else if (capacidad >= limitMiddle && capacidad < limitUp) {
                newAlert.tipo = alerts[1].nombre;
                newAlert.nivel = 'Media';
                if (alerts[1].estado) {
                    try {
                        saveAlert(newAlert);
                    } catch (error) {
                        console.log('ERROR EN SAVE ALERT:', error);
                    }
                }
            } else if (capacidad >= limitUp) {
                newAlert.tipo = alerts[2].nombre;
                newAlert.nivel = 'Alta';
                if (alerts[2].estado) {
                    try {
                        saveAlert(newAlert);
                    } catch (error) {
                        console.log('ERROR EN SAVE ALERT:', error);
                    }
                }
            } else {
                // console.log('ALERTA NO CREADA', capacidad, limitDown, limitMiddle, limitUp);
            }
            alerts = null;
            aux = null;
            capacidad = null;
            limitDown = null;
            limitMiddle = null;
            limitUp = null;
            newAlert = null;
        }
    }
    device = null;
}

const verificarAlertsTypeM = async (item) => {
    const device = await getDeviceMById(item.identificador, item.tipo);
    if (device) {
        const alerts = device.alertas;
        if (alerts.length > 0) {
            for (const alert of alerts) {
                if (!alert.estado) continue;

                const currentValue = getValueForAlertByParam(alert.nombre, item);
                const limit = alert.valor;
                let isValidOnRange = true;
                if (alert.porcentaje_aceptacion !== -1){
                    const range = Math.round( (limit/100)*alert.porcentaje_aceptacion );
                    isValidOnRange = verifyValueInRange(currentValue, limit, (limit-range), (limit+range));
                } else {
                    isValidOnRange = verifyValueInRange(currentValue, limit);
                }

                if (!isValidOnRange) {
                    const newAlert = {
                        tipo: alert.nombre,
                        dispositivo: item.identificador,
                        fecha: item.fecha,
                        hora: item.hora,
                        valor: currentValue,
                        observaciones: '',
                        estado: 'Activa',
                        nivel: 'Alta'
                    };
                    {
                        try {
                            saveAlert(newAlert);
                        } catch (error) {
                            console.log('ERROR EN SAVE ALERT:', newAlert);
                        }
                    }
                }
            }
        }
    }
}

const getValueForAlertByParam = (type, currentData) => {
    switch(type) {
        case 'Alerta de MAA4': return parseFloat(currentData.maa4);
        case 'Alerta de MAA5': return parseFloat(currentData.maa5);
        case 'Alerta de MAA6': return parseFloat(currentData.maa6);
        case 'Alerta de MVA1': return parseFloat(currentData.mva1);
        case 'Alerta de MVA2': return parseFloat(currentData.mva2);
        case 'Alerta de MVA3': return parseFloat(currentData.mva3);
        default: 0;
    }
}

const verifyValueInRange = (currentValue, limit, limitDown = -1, limitUp = -1) => {
    // console.log('VERIFIGING RANGE', currentValue, limit, limitDown, limitUp);
    if (limitDown !== -1 && limitUp !== -1) {
        return ( currentValue >= limitDown && currentValue <= limitUp );
    } else {
        return currentValue <= limit;
    }
}

const verificarAlertsTypeR = (item) => {
    console.log('PROCESSING DATA FOR TYPE R');
}

const verificarAlertsTypeE = (item) => {
    console.log('PROCESSING DATA FOR TYPE E');
}

const getDeviceSById = (id, type) => {
    const device = (type.toString().toLowerCase().includes('tanque'))
        ? getTanqueById(id)
        : getSensorById(id);
    return device;
}

const getDeviceMById = (id) => {
    return getPozoById(id);
}

module.exports = {
    verificarAlertsTypeS,
    verificarAlertsTypeM,
    getDevices
}