var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');

var TipoVehiculo = require('../models/tipoVehiculo');

var util = require('../util/util');
var genericQuery = require('../util/genericQueriesHelper');

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

router.get('/tipo/vehiculos', function (req, res, next) {
    TipoVehiculo.find().exec()
        .then(function (result) {
            if (result.length > 0) {
                const dataTosend = result;
                result.status = result.status
                    ? 'Habilitado' : 'Deshabilitado';
                return res.status(200).json({
                    statusCode: 200,
                    message: 'Se obtuvieron los tipos con exito',
                    data: dataTosend
                });
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
            next(err);
        });
});


//ESTE POST ME SIRVE PARA REGISTRAR UN NUEVO TIPO DE VEHÍCULO EN LA BASE DE DATOS
router.post('/tipo/vehiculo/add', upload.single('iconoTipoVehiculo'), function (req, res, next) {
    var newCut = util.cutFilePath(req.file.path);
    var pNombreTipoVehiculo = req.body.nombreTipoVehiculo;
    TipoVehiculo.find({ nombreTipoVehiculo: pNombreTipoVehiculo }).exec()
        .then(function (result) {
            if (result.length > 0) {
                const error = new Error('Este tipo de vehiculo ya fue registrado');
                error.statusCode = 409;
                throw error;
            } else {
                var nuevoTipoVehiculo = new TipoVehiculo({
                    _id: new mongoose.Types.ObjectId(),
                    nombreTipoVehiculo: req.body.nombreTipoVehiculo.toLowerCase(),
                    iconoTipoVehiculo: newCut,
                    status: req.body.status
                });
                return nuevoTipoVehiculo.save();
            }
        }).then(function (result) { //LO QUE ME PASA AL RESULT ES EL OBEJTO GUARDADO EN FORMATO JSON
            return res.status(201).json({
                statusCode: 201,
                message: 'Se creo con exito el tipo de vehiculo, ' + result.nombreTipoVehiculo,
                data: result
            });
        })
        .catch(function (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
});

router.get('/tipo/vehiculo/search/:sValue', (req, res, next) => {
    const { sValue } = req.params;
    const searchHelper = genericQuery.searchAgregtHelper(TipoVehiculo, sValue, {
        _id: 0
    });
    if (sValue === 'null') return res.redirect('/configuracion/tipo/vehiculos');
    TipoVehiculo.aggregate()
        .addFields({ ...searchHelper.addFields })
        .project({ ...searchHelper.projectReduce })
        .project({ ...searchHelper.projectShowFields })
        .match({ ...searchHelper.match })
        .then(docs => {
            if (docs.length === 0) {
                const error = new Error('No se encontraron coincidencias con esa descripción');
                error.statusCode = '404';
                throw error;
            }
            return res.status(201).json({
                statusCode: 201,
                message: 'Se encontro la lista con exito!',
                data: docs
            });

        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        });
});


//ESTE GET ME OBTIENE TODOS LOS TIPOS DE VEHÍCULOS DE LA BASE DE DATOS
module.exports = router;