const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Vehicle = require('../models/vehicle');
const util = require('../util/util');
const genericQuery = require('../util/genericQueriesHelper');
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
    const { numeroPlaca, marca, model, anio, color, type, correo, conductor } = req.body;
    const vehiclePictures = [];

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
        fotos: vehiclePictures,
        usuario: correo,
        conductor: conductor
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

router.get('/:userEmail', (req, res, next) => {
    const userEmail = req.params.userEmail;
    console             .log(userEmail);

    Vehicle.find({ usuario: userEmail })
        .then(list => {
            if (list.length < 1) {
                const errNotFound = new Error('Este usuario no tiene ningun vehiculo, propio o asociado');
                errNotFound.statusCode = 404;
                throw errNotFound;
            }
            return res.status(200).json({
                statusCode: 200,
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

router.get('/search/all/:sValue', (req, res, next) => {
    const { sValue } = req.params;
    const searchHelper = genericQuery.searchAgregtHelper(Vehicle, sValue, {
        _id: 0
    });
    if (sValue === 'null') return res.redirect('/vehicles');
    Vehicle.aggregate()
        .addFields({ ...searchHelper.addFields })
        .project({ ...searchHelper.projectReduce })
        .project({ ...searchHelper.projectShowFields })
        .match({ ...searchHelper.match })
        .then(docs => {
            if (docs.length === 0) {
                const error = new Error('No se encontraron vehiculos con esa descripción');
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


router.get('/:userEmail/search/:sValue', (req, res, next) => {
    const { sValue, userEmail } = req.params;
    const searchHelper = genericQuery.searchAgregtHelper(Vehicle, sValue, {
        _id: 0
    });
    const matchedValues = sValue === 'null' ? {} : { ...searchHelper.match };
    Vehicle.aggregate()
        .addFields({ ...searchHelper.addFields })
        .project({ ...searchHelper.projectReduce })
        .project({ ...searchHelper.projectShowFields })
        .match(matchedValues)
        .match({ usuario: userEmail })
        .then(docs => {
            if (docs.length === 0) {
                const error = new Error('No se encontraron vehiculos con esa descripción');
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


router.get('/', (req, res, next) => {
    Vehicle.find()
        .then(result => {
            if (result.length < 1) {
                errNotFound = new Error('No hay vehiculos registrados');
                errNotFound.statusCode = 404;
                throw errNotFound;
            }
            return res.status(201).json({
                statusCode: 201,
                message: 'Vehiculos obtenidos con exito',
                data: result
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
});
module.exports = router;