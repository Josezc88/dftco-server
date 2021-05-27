const express = require('express');
require('dotenv').config();

const { database, firestore, sanitizate } = require('./config/firebase');
// SERVIDOR
const app = express();

// PUBLIC DIRECTORY
app.use( express.static('public') );

// RUTAS
// app.get('/', (req, res) => {
//     console.log('INDEX.JS');
//     res.json({
//         ok: true
//     })
// });

database.ref().on('value', (snapshot)  => {
    const data = snapshot.val();
    // console.log( data );
    Object.keys(data).forEach((key, index) => {
        if (!key.endsWith(',') && (key.startsWith('S') || key.startsWith('M'))) {
            const item = data[key];
            const newItem = {};
            Object.keys(item).forEach((value, i) => {
                newItem[value] = sanitizate(item[value]);
            });
            firestore.collection('Jerez').doc('data').collection(key).add(newItem);
        }
    });
});

// firestore.collection('Jerez').doc(key).collection(key).add(newItem);
// const fullDocument = {
//     id: key,
//     data: newItem
// }
// firestore.collection('Jerez').add(fullDocument)
//     .then(res => {
//         console.log(res);
//     });

// Empezar a escuchar
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});