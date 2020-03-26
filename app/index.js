const mongoose = require('mongoose');
const express = require('express');
const app = express();

const getRoadviserDbConnection = require('./util/database');

const port = 8082;



getRoadviserDbConnection()
    .then((res) => {
        console.log(res, '\n', 'Connection establish with Roadvisor data base!');
        app.listen(port, () => {
            console.log('Server is running on port: ' + port);
        });
    })
    .catch((err) => {
        console.error(err);
    });