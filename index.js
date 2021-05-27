const express = require('express');
require('dotenv').config();

// Firebase config
// const { database, firestore, sanitizate } = require('./config/firebase');
const { getFirebaseData} = require('./config/firebase');
// SERVIDOR
const app = express();

// PUBLIC DIRECTORY
app.use( express.static('public') );

getFirebaseData();

// Empezar a escuchar
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});