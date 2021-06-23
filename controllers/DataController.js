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

const getTanqueById = async(id) => {
    const serverURL = `${process.env.API_URL_TANQUES}readById?deviceID=${id}`;
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

const getPozoById = async(id) => {
    const serverURL = `${process.env.API_URL_POZOS}readById?id=${id}`;
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

const getSensorById = async(id) => {
    const serverURL = `${process.env.API_URL_SENSORES}readById?id=${id}`;
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

module.exports = {
    getTanqueById,
    getSensorById,
    getPozoById
}