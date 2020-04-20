var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');

var TipoVehiculo = require('../models/tipoVehiculo');

var util = require('../util/util');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './../public/assets/icons');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, "icono " + file.originalname);
    }
});
var upload = multer({
    storage: storage
});

router.get('/tipoVehiculos', function (req, res, next) {
    TipoVehiculo.find().exec()
        .then(function (result) {
            if (result.length > 0) {
                return res.status(201).json(result);
            } else {
                const error = new Error('No se encuentran tipos de vehiculos');
                error.statusCode = 404;
                throw error;
            }
        }).catch(function (err) {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        });
});
