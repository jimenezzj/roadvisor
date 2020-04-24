const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();

const getRoadviserDbConnection = require('./util/database');
const util = require('./util/util');
const tokenVerification = require('./middleware/validateToken');
const auth = require('./controllers/auth');
const user = require('./controllers/usuario');
const vehicles = require('./controllers/vehicles');
const tipos = require('./controllers/tipos');
const configuracion = require('./controllers/configuracion');
const tarjetas = require('./controllers/tarjetas');

const port = 8082;

app.use(express.static(path.join(util.getMainDirectory, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', auth);
app.use('/users',
    // tokenVerification.validateToken,
    user);
app.use('/vehicles', vehicles);
app.use('/tipos', tipos);
app.use('/configuracion', configuracion);
app.use('/tarjetas', tarjetas);

app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({
        statusCode: status,
        message: err.message
    });
});

getRoadviserDbConnection()
    .then((res) => {
        console.log('Connection establish with Roadvisor data base!');
        app.listen(port, () => {
            console.log('Server is running on port: ' + port);
        });
    })
    .catch((err) => {
        console.error(err);
    });