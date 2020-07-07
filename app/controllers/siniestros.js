var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//EXPORTACIONES DE LOS SCHEMAS QUE VOY A USAR PARA REGISTAR AL USUARIO
var Siniestro = require('../models/siniestro');
var rutaSiniestro = require('../models/ruta');
var tipoIncidente = require('../models/tipoIncidente');

//IMPORTO UTIL
var util = require('../util/util');

//CODIGO PARA GUARDAR LA IMAGEN EN MONGO DB
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './../public/assets/images/fotosSiniestros');
    },
    filename: function(req, file, cb) {
        console.log(file);
        cb(null, "fotoSiniestro" + file.originalname);
    }
});
var upload = multer({
    storage: storage
});
// TERMINA CODIGO PARA GUARDAR LA IMAGEN EN MONGO DB


//ESTE POST ME SIRVE PARA REGISTRAR UN NUEVO SINIESTROS REPORTADO
router.post('/registrarSiniestroReportado', upload.single('fotoSiniestro'), function(req, res, next) {
    var newCut = util.cutFilePath(req.file.path) //REPRESENTA LA FOTO DEL SINIESTRO
    console.log(req.body.tipoSiniestroReportado)
    console.log(req.body.rutaSiniestro)
    console.log(req.file.path)
    console.log(req.body.direccionExactaSiniestro)
    console.log(req.body.descripcionSiniestro)

    var nuevoSiniestroReportado = new Siniestro({
        _id: new mongoose.Types.ObjectId(),
        tipoSiniestroReportado: req.body.tipoSiniestroReportado,
        rutaSiniestroReportado: req.body.rutaSiniestro,
        fotoSiniestroReportado: newCut,
        direccionSiniestroReportado: req.body.direccionExactaSiniestro,
        descripcionSiniestroReportado: req.body.descripcionSiniestro
    });
    nuevoSiniestroReportado.save()
    .then(ressult => {
        return res.status(201).json({
            statusCode: 201,
            message: 'Se reporto con exito el siniestro',
            data: ressult
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });

});

//ESTE GET ME OBTIENE TODAS LAS RUTAS EN LA BASE DE DATOS
router.get('/listarRutasDisponibles', function(req, res) {
    rutaSiniestro.find().exec()
        .then(function(result) {
            if (result.length > 0) {
                return res.json(result);
            } else {
                return res.json({
                    error: 404,
                    mensaje: 'No se encuentran elementos'
                });
            }
        }).catch(function(err) {
            console.log(err);
        });
});

router.get('/listarTipoDeSiniestros', function(req, res) {
    tipoIncidente.find().exec()
        .then(function(result) {
            if (result.length > 0) {
                return res.json(result);
            } else {
                return res.json({
                    error: 404,
                    mensaje: 'No se encuentran elementos'
                });
            }
        }).catch(function(err) {
            console.log(err);
        });
});

router.get('/listarSiniestrosReportados', function(req, res) {
    Siniestro.find().exec()
        .then(function(result) {
            if (result.length > 0) {
                return res.json(result);
            } else {
                return res.json({
                    error: 404,
                    mensaje: 'No se encuentran elementos'
                });
            }
        }).catch(function(err) {
            console.log(err);
        });
})

module.exports = router;