var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var buscador = require('../util/genericQueriesHelper');
//IMPORTO MÓDULO DE NODEMAILER
var nodemailer = require('nodemailer');
//IMPORTACIONES DE LOS SCHEMAS QUE VOY A USAR PARA REGISTAR LA RUTA
var ruta = require('../models/ruta');
//IMPORTO UTIL DE CUTFILEPATH
var util = require('../util/util');
//CODIGO PARA GUARDAR LA IMAGEN EN MONGO DB
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './../public/assets/images/userProfile');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, "profilePicture" + file.originalname);
    }
});
var upload = multer({
    storage: storage
});
// TERMINA CODIGO PARA GUARDAR LA IMAGEN EN MONGO DB
//ESTE POST ME SIRVE PARA REGISTRAR AL NUEVO USUARIO EN LA BASE DE DATOS CON SUS DATOS PERSONALES
router.post('/add', function (req, res, next) {
    var pNombreRuta = req.body.nombreRuta;
    ruta.find({ nombreRuta: pNombreRuta }).exec()
        .then(function (result) {
            if (result.length > 0) {
                return res.status(202).json('202: La ruta ya existe');
            } else {
                var nuevaRuta = new ruta({
                    _id: new mongoose.Types.ObjectId(),
                    nombreRuta: req.body.nombreRuta,
                    provinciaRuta: req.body.provinciaRuta,
                    puntoInicio: req.body.puntoInicio,
                    puntoFinal: req.body.puntoFinal,
                    status: req.body.status,
                    coordenadas: ''
                });
                return nuevaRuta.save();
            }
        }).then(function (result) { //LO QUE ME PASA AL RESULT ES EL OBEJTO GUARDADO EN FORMATO JSON
            return res.json(result);
        })
        .catch(function (err) {
            console.log(err);
        });
});
router.put('/encontrarRuta', function (req, res) { //EL RES ES LA RESPUESTA
    var coordenadas = req.body.coordenadas;
    var nombreRuta = req.body.nombreRuta;
    console.log(nombreRuta);
    ruta.find({ nombreRuta: nombreRuta }).exec()
        .then(function (result) {
            console.log(coordenadas);
            console.log(result[0].nombreRuta);
            if (result.length > 0) {
                if (result[0].nombreRuta == nombreRuta) {
                    return res.json({
                        status: 200,
                        mensaje: 'Ruta Encontrada'
                    })
                } else {
                    return res.json({
                        status: 400,
                        mensaje: 'Ruta no encontrada'
                    })
                }
            }
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            return res.status(err.statusCode).json({
                message: err.message,
                statusCode: err.statusCode,
            });
        });

});
//ESTE ROUTER SIRVE PARA ACTUALIZAR LA CONTRASEÑA DEL USUARIO
router.post('/nuevasCoordenadas', function (req, res) {
    var coordenadas = req.body.coordenadas;
    var nombreRuta = req.body.nombreRuta;
    //var correoGuardado = req.body.correo;
    console.log(coordenadas);
    //console.log(correoGuardado);
    ruta.find({ nombreRuta: nombreRuta }).exec()
        .then(function (result) {
            if (result.length > 0) {
                result[0].coordenadas = coordenadas; //AGREGO LAS NUEVAS COORDENADAS
                console.log(result[0].coordenadas)
                console.log(result);
                result[0].save();
                return res.json({
                    status: 200,
                    mensaje: 'Coordenadas Guardadas exitosamente'
                })

            } else {
                return res.json({
                    status: 404,
                    mensaje: 'Ruta no encontrada'
                })
            }

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            return res.status(err.statusCode).json({
                message: err.message,
                statusCode: err.statusCode,
            });
        });
});
router.get('/list', function (req, res) {
    ruta.find().exec()
        .then(function (result) {
            if (result.length > 0) {
                return res.json(result);
            } else {
                return res.json({
                    error: 404,
                    mensaje: 'No se encuentran elementos'
                });
            }
        }).catch(function (err) {
            console.log(err);
        });
});

router.post('/buscarRutaAModificar', function (req, res) {
    var buscarRutaAModificar = req.body.buscarRutaAModificar;

    ruta.find({ nombreRuta: buscarRutaAModificar }).exec()
        .then(function (result) {
            if (result.length > 0) {
                console.log(result[0].nombreRuta);
                console.log(result[0].puntoInicio);
                console.log(result[0].puntoFinal);
                return res.json(result);
            } else {
                return res.json({
                    status: 404,
                    mensaje: 'Ruta no encontrado'
                });
            }
        })
        .catch(function (err) {
            console.log(err);
        });
});

router.put('/edit', function (req, res) {
    var nombreRutaActual = req.body.nombreRutaActual;
    var nuevoNombreRuta = req.body.nuevoNombreRuta;
    var nuevoPuntoInicio = req.body.nuevoPuntoInicio;
    var nuevoPuntoFinal = req.body.nuevoPuntoFinal;
    var nuevasCoordenadas = req.body.nuevasCoordenadas;
    console.log(nombreRutaActual);
    console.log(nuevoNombreRuta);
    console.log(nuevoPuntoInicio);
    console.log(nuevoPuntoFinal);
    ruta.find({ nombreRuta: nombreRutaActual }).exec()
        .then(function (result) {
            if (result.length > 0) {
                console.log(nombreRutaActual);
                console.log(nuevoNombreRuta);
                console.log(nuevoPuntoInicio);
                console.log(nuevoPuntoFinal);
                console.log(nuevasCoordenadas);
                result[0].nombreRuta = nuevoNombreRuta;
                result[0].puntoInicio = nuevoPuntoInicio;
                result[0].puntoFinal = nuevoPuntoFinal;
                result[0].coordenadas = nuevasCoordenadas;
                result[0].save();
            }
        })
        .then(function (result) {
            return res.json(result);
        })
        .catch(function (err) {
            console.log(err);
        });
});

/*Cambiar estado de rutas*/
router.patch('/desh', (req, res) => {
    var mensaje;
    ruta.findOne({ _id: req.body._id })
        .then(result => {
            return result;
        })
        .then(data => {
            return ruta.updateOne({ _id: data._id }, { status: !data.status })

        }).then(data => {
            console.log(data);
            return res.json({ mensaje: "Exitoso" });
        })
        .catch(err => {
            console.log(err);
        });
})
router.get('/search/:searchVal', (req, res, next) => {
    const { searchVal } = req.params;
    const searchHelper = buscador.searchAgregtHelper(ruta, searchVal, {
        _id: 0,
    });
    ruta.aggregate([
        { '$addFields': searchHelper.addFields },
        { '$project': searchHelper.projectReduce },
        { '$project': searchHelper.projectShowFields },
        { '$match': searchHelper.match }
    ])
        .then(docs => {
            if (docs.length === 0) {
                const error = new Error('No se encontaron las rutas con esa descripcion');
                error.statusCode = '404';
                throw error;
            }
            return res.status(201).json({
                statusCode: 201,
                message: 'Se encontraron rutas, con la desccripción: ' + searchVal,
                data: docs
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            return res.json({
                statusCode: err.statusCode,
                message: err.message
            })
        })
});
router.get('/search/', (req, res, next) => {
    return res.redirect('/rutas/list');

});

module.exports = router;