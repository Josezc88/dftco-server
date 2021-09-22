const { response } = require('express');
const fetch = require('node-fetch');

const getTanques = async() => {
    const serverURL = process.env.API_URL_TANQUES;
    return new Promise((resolve, reject) => {
        fetch(serverURL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        })
        .then(resp => resp.json())
        .catch(error => reject(error))
        .then(resp => resolve(resp.data))
        .catch(error => reject(error));
    });
}

const getPozos = async() => {
    const serverURL = process.env.API_URL_POZOS;
    return new Promise((resolve, reject) => {
        fetch(serverURL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        })
        .then(resp => resp.json())
        .catch(error => reject(error))
        .then(resp => resolve(resp.data))
        .catch(error => reject(error));
    });
}

const getSensores = async() => {
    const serverURL = process.env.API_URL_SENSORES;
    return new Promise((resolve, reject) => {
        fetch(serverURL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        })
        .then(resp => resp.json())
        .catch(error => reject(error))
        .then(resp => resolve(resp.data))
        .catch(error => reject(error));
    });
}

const parseJSONAndGetData = (json) => {
    // console.log('JSON:', json);
    try {
        const resp = JSON.parse(json);
        // console.log('DEVICE', resp.data);
        return resp.data;
    } catch (error) {
        return null;
    }
}

const getTanqueById = async(id) => {
    const serverURL = `${process.env.API_URL_TANQUES}readById?deviceID=${id}`;
    // console.log(serverURL);
    return new Promise((resolve, reject) => {
        fetch(serverURL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        })
        .then(resp => resp.text())
        .catch(error => reject(error))
        .then(resp => resolve( parseJSONAndGetData(resp) ))
        .catch(error => reject(error));
    });
}

const getPozoById = async(id) => {
    const serverURL = `${process.env.API_URL_POZOS}readById?id=${id}`;
    // console.log(serverURL);
    return new Promise((resolve, reject) => {
        fetch(serverURL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        })
        .then(resp => resp.text())
        .catch(error => reject(error))
        // .then(resp => resolve(resp.data))
        .then(resp => resolve( parseJSONAndGetData(resp) ))
        .catch(error => reject(error));
    });
}

const getSensorById = async(id) => {
    const serverURL = `${process.env.API_URL_SENSORES}readById?id=${id}`;
    // console.log(serverURL);
    return new Promise((resolve, reject) => {
        fetch(serverURL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY,
            }
        })
        .then(resp => resp.text())
        .catch(error => reject(error))
        // .then(resp => resolve(resp.data))
        .then(resp => resolve( parseJSONAndGetData(resp) ))
        .catch(error => reject(error));
    });
}

module.exports = {
    getTanqueById,
    getSensorById,
    getPozoById
}