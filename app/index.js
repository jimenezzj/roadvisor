const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();

const getRoadviserDbConnection = require('./util/database');
const util = require('./util/util');

const port = 8082;

app.use(express.static(path.join(util.getMainDirectory, 'public')));
app.use(express.json());
// app.use(express.bodyParser({ extended: false }));


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