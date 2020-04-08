const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Vehicle = require('../models/vehicle');
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
    const { numeroPlaca, model, anio, color, type } = req.body;
    const vehiclePictures = [req.files[0].path];
    const newVehicle = new Vehicle({
        _id: mongoose.Types.ObjectId(),
        numeroPlaca: numeroPlaca,
        model: model,
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

module.exports = router;