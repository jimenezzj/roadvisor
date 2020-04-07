const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();

const getRoadviserDbConnection = require('./util/database');
const util = require('./util/util');
const user = require('./controllers/usuario');

const port = 8082;

app.use(express.static(path.join(util.getMainDirectory, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', user);

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