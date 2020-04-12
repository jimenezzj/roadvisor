const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Vehicle = require('../models/vehicle');
const util = require('../util/util');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './../public/assets/images/vehiclesPictures',
    filename: (req, file, cb) => {
        const pictureName = new Date().toISOString().split('T')[0]
            + '_' + req.body.numeroPlaca
            + '_' + file.originalname;
        cb(null, pictureName);
    }
});

const upload = multer({ storage: storage });

router.post('/add', upload.array('vehiclePictures'), (req, res) => {
    const { numeroPlaca, marca, model, anio, color, type } = req.body;
    const vehiclePictures = [];
    console.log(req.files);
    
    req.files.forEach(file => vehiclePictures.push(
        util.cutFilePath(file.path)
    ));
    const newVehicle = new Vehicle({
        _id: mongoose.Types.ObjectId(),
        numeroPlaca: numeroPlaca,
        marca: marca,
        modelo: model,
        anio: anio,
        color: color,
        type: type,
        fotos: vehiclePictures
    });
    Vehicle.findOne({ numeroPlaca: numeroPlaca })
        .then(sResult => {
            if (sResult) {
                const error = new Error('Ya hay un vehiculo registrado con el numero de placa: ' + sResult.numeroPlaca);
                error.statusCode = 409;
                throw error;
            }
            return newVehicle.save(newVehicle);
        })
        .then(response => {
            return res.json({
                statusCode: 201,
                message: 'El vehiculo fue agregado con exito',
                data: response
            });
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            return res.status(err.statusCode).json({
                statusCode: err.statusCode,
                message: err.message
            });
        });
});

router.get('/', (req, res, next) => {
    Vehicle.find({})
        .then(list => {
            return res.status(201).json({
                statusCode: 201,
                message: 'Se obtuvo la lista de vehiculos con exito!',
                data: list
            })
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            return res.status(err.statusCode).json({
                statusCode: err.statusCode,
                message: err.message
            });
        });
});

router.get('/search/:sValue', (req, res, next) => {
    const { sValue } = req.params;
    const orArray = [];
    Vehicle.schema.eachPath(path => {
        let field;
        if (path !== '__v' && path !== '_id' && path !== 'anio') {
            field = { [path]: { '$regex': sValue } }
            orArray.push(field)
        };
    });
    Vehicle.find({ $or: orArray })
        .then(docs => {
            if (docs.length === 0) {
                const error = new Error('No se encontraron vehiculos');
                error.statusCode = '404';
                throw error;
            }
            return res.status(201).json({
                statusCode: 201,
                message: 'Se encontraron vehiculos!',
                data: docs
            });

        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        });

});

module.exports = router;