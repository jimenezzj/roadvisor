const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');

const TipoAsistencia = require('../models/tipoAsistencia');
const TipoIncidente = require('../models/tipoIncidente');
const TipoVehiculo = require('../models/tipoVehiculo');
const util = require('../util/util');

const storage = (dir) => multer.diskStorage({
    // destination: './../public/assets/images/tipoAsistenciaPictures',
    // destination: './../public/assets/images/tipoIncidentePictures',
    destination: dir,
    filename: (req, file, cb) => {
        const pictureName = new Date().toISOString().split('T')[0]
            + '_' + file.originalname;
        cb(null, pictureName);
    }
});

const upload = (dir) => multer({ storage: storage(dir) });


router.post('/asistencia/add',
    upload('./../public/assets/images/tipoAsistenciaPictures').single('icono'),
    (req, res, next) => {
        var newPath = util.cutFilePath(req.file.path);
        TipoAsistencia
            .findOne({ nombre: req.body.nombre.toLowerCase() })
            .then(data => {
                if (data !== null) {
                    const err = new Error('El nombre ya esta siendo utilizado');
                    err.statusCode = 500;
                    throw err;
                }
                var asistenciaNuevo = new TipoAsistencia({
                    _id: new mongoose.Types.ObjectId(),
                    nombre: req.body.nombre.toLowerCase(),
                    icono: newPath
                });
                return asistenciaNuevo.save();
            })
            .then(result => {
                console.log(result)
                return res.status(201).json({
                    message: 'La asistencia fue guardada correctamente',
                    user: result

                });
            })
            .catch(err => {
                console.log(err);
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    });

router.post('/incidentes/add',
    upload('./../public/assets/images/tipoIncidentePictures').single('icono'),
    function (req, res, next) {
        var newPath = util.cutFilePath(req.file.path);
        TipoIncidente
            .findOne({ nombre: req.body.nombre.toLowerCase() })
            .then(data => {
                console.log(data);
                if (data) {
                    const err = new Error('El nombre ya esta siendo utilizado');
                    err.statusCode = 500;
                    throw err;
                }
                var incidenteNuevo = new TipoIncidente({
                    _id: new mongoose.Types.ObjectId(),
                    nombre: req.body.nombre.toLowerCase(),
                    icono: newPath//Preguntar  fileName
                });
                return incidenteNuevo.save()
            })
            .then(result => {
                return res.status(201).json({
                    statusCode: 201,
                    message: 'EL incidente fue guardado correctamente',
                    data: result
                });
            })
            .catch(err => {
                console.log(err);
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    });

router.get('/asistencia', function (req, res) {
    TipoAsistencia.find()
        .then(data => {
            if (data.length < 1) {
                const err = new Error('No se encontraro tipos de sistencia con ese nombre');
                err.statusCode = 404;
                throw err;
            }
            return res.status(201).json({
                statusCode: 201,
                message: 'Se obtuvo la lista de tipos de asistencia con exito',
                data: data
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
});

router.get('/asistencia/search/:asisName', function (req, res, next) {
    TipoAsistencia.find({ nombre: req.params.asisName })
        .then(data => {
            if (data.length < 1) {
                const err = new Error('No se encontraro tipos de asistencia con ese nombre');
                err.statusCode = 404;
                throw err;
            }
            return res.status(201).json({
                statusCode: 201,
                message: 'Se encontro el tipo de asistencia',
                data: data
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
});

router.get('/asistencia/search/', (req, res) => {
    res.redirect('/tipos/asistencia');
});


router.get('/incidente', function (req, res) {
    TipoIncidente.find()
        .then(data => {
            if (data.length < 1) {
                const err = new Error('No se encontraro tipos de incidentes con ese nombre');
                err.statusCode = 404;
                throw err;
            }
            return res.status(200).json({
                statusCode: 200,
                message: 'Se obtuvo la lista de tipos de incidente con exito',
                data: data
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
});


router.get('/incidente/search/:inciName', function (req, res, next) {
    TipoIncidente.find({ nombre: req.params.inciName })
        .then(data => {
            if (data.length < 1) {
                const err = new Error('No se encontraro tipos de incidente con ese nombre');
                err.statusCode = 404;
                throw err;
            }
            return res.status(201).json({
                statusCode: 201,
                message: 'Se encontro tipos de incidente que coinciden con la descripción',
                data: data
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
});

router.get('/incidente/search/', (req, res) => {
    res.redirect('/tipos/incidente');
});

module.exports = router;