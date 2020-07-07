const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const User = require('../models/usuario');
const util = require('../util/util');
const genericQuery = require('../util/genericQueriesHelper');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './../public/assets/images/userProfile');
    },
    filename: (req, file, cb) => {
        const dateString = new Date().toISOString().split('').filter(e => e !== ':').join('');
        const name = dateString + '_' + req.body.email + '_' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

router.get('/profile/:userEmail', function (req, res, next) {
    const { userEmail } = req.params;

    User.findOne({ email: userEmail })
        .select('-contrasena -_id -__v')
        .then(function (result) {
            if (result._doc) {
                console.log(result._doc);
                const userToSend = { ...result._doc };
                userToSend.genero = userToSend.genero.toString();
                userToSend.tipo = userToSend.tipo.toString();

                return res.json({
                    statusCode: 201,
                    message: 'Información de perfil obtenida con exito',
                    data: userToSend
                });
            } else {
                return res.json({
                    statusCode: 404,
                    mensaje: 'Usuario no encontrado'
                });
            }
        })
        .catch(function (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        });
});

router.post('/add', upload.single('profilePicture'), (req, res) => {
    // console.log(req.file);
    const user = {};
    Object.keys(req.body).forEach(userKey => {
        user[userKey] = req.body[userKey];

    });
    user.tipo = 'ruta';
    user.contrasena = '50m3*R4ND0M-p4s5wOr9';
    if (req.file) user.profilePicture = util.cutFilePath(req.file.path);
    // console.log(user);
    User.findOne({ email: user.email })
        .then(data => {
            if (data !== null) {
                const err = new Error('Formulario invalido');
                err.statusCode = 500;
                err.fields = {
                    email: { value: data.email, errors: ['El usuario ya tiene una cuenta registrada'] }
                };
                throw err;
            }
            return new User({
                _id: mongoose.Types.ObjectId(),
                status: true,
                ...user
            }).save()
        }).then(result => {
            return res.status(201).json({
                statusCode: 201,
                message: 'Usuario de rutas fue creado exitosamente',
                user: result
            });
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            return res.status(err.statusCode).json({
                message: err.message,
                statusCode: err.statusCode,
                fields: err.fields,
            });
        });
});

//ESTE POST ME SIRVE PARA REGISTRAR AL NUEVO USUARIO EN LA BASE DE DATOS CON SUS DATOS PERSONALES
router.post('/add/tradicional', upload.single('profilePicture'), function (req, res, next) {
    var { correo } = req.body;
    User.find({ email: correo }).exec()
        .then(function (result) {
            if (result.length > 0) {
                const error = new Error('Este correo ya cuenta con una cuenta');
                error.statusCode = 409;
                throw error;
            } else {
                var caracteres = '012349$%#@+acjqrÑszA';
                var resultado = '';
                for (let i = caracteres.length; i > 0; --i) {
                    resultado += caracteres[Math.floor(Math.random() * caracteres.length)];
                }
                var nuevoUsuarioTradicional = {
                    _id: new mongoose.Types.ObjectId(),
                    numeroCedula: req.body.numeroCedula,
                    email: req.body.correo,
                    contrasena: resultado,
                    tipo: 'tradicional',
                    nombre: req.body.nombre,
                    telefono: req.body.telefono,
                    status: true
                };
                if (req.file) nuevoUsuarioTradicional.profilePicture = util.cutFilePath(req.file.path);
                if (req.body.nTipoEntidadJuridica && req.body.tipoEntidadJuridica) {
                    nuevoUsuarioTradicional.tipoEntidadJuridica = req.body.tipoEntidadJuridica

                } else {
                    nuevoUsuarioTradicional.fechaNacimiento = req.body.fechaNacimiento;
                    nuevoUsuarioTradicional.genero = req.body.genero;
                    nuevoUsuarioTradicional.pApellido = req.body.pApellido;
                    nuevoUsuarioTradicional.sApellido = req.body.sApellido;
                }
            }

            return new User(nuevoUsuarioTradicional).save();
        })
        .then((result) => { //LO QUE ME PASA AL RESULT ES EL OBEJTO GUARDADO EN FORMATO JSON
            if (result != null) {
                //ESTAS VARIABLES DE AQUÍ ME GENERAN UN CODIGO ALEATORIO QUE SE ENVÍA AL CORREO
                //FUNCIÓN PARA ENVIAR CORREO ELECTRÓNICOS/////////////////////////////////////////////////////////////
                // var transporter = nodemailer.createTransport({
                //     host: 'mail.pjimenezcr.com',
                //     port: 587,
                //     secure: false,
                //     auth: {
                //         user: 'noobdevs@pjimenezcr.com',
                //         pass: 'contraseña'
                //     },
                //     tls: {
                //         rejectUnauthorized: false
                //     }
                // });
                // var mailOptions = {
                //     from: 'noobDevs@gmail.com',
                //     to: req.body.correo,
                //     subject: 'Código de verificación',
                //     text: "Ingresa este código de verificación para crear tu contraseña: " + result.contrasena
                // };
                // transporter.sendMail(mailOptions, function (error, info) {
                //     if (error) {
                //         throw error;
                //     } else {
                //         console.log('Email enviado: ' + info.response);
                //     }
                // });
            }
            return res.json({
                statusCode: 201,
                message: 'Usuario registrado exitosamente!',
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

router.post('/add/servicio', upload.single('profilePicture'), function (req, res, next) {
    User.find({ email: req.body.correo }).exec()
        .then(function (result) {
            if (result.length > 0) {
                const err = new Error('Este correo ya tiene una cuenta registrada');
                err.statusCode = 409;
                throw err;
            } else {
                var caracteres = '012349$%#@+acjqrÑszA';
                var resultado = '';
                for (let i = caracteres.length; i > 0; --i) {
                    resultado += caracteres[Math.floor(Math.random() * caracteres.length)];
                }
                var nuevoUsuarioEspecializado = {
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.correo,
                    contrasena: resultado,
                    tipo: 'servicio',
                    numeroCedula: req.body.numeroCedula,
                    nombre: req.body.nombre,
                    telefono: req.body.telefono,
                    costo: req.body.costo,
                    tipoServicio: req.body.tipoServicio,
                    status: false,
                };
                if (req.file) nuevoUsuarioEspecializado.profilePicture = util.cutFilePath(req.file.path);

                if (req.body.tipoEntidadJuridica) {
                    nuevoUsuarioEspecializado.tipoEntidadJuridica = req.body.tipoEntidadJuridica

                } else {
                    nuevoUsuarioEspecializado.fechaNacimiento = req.body.fechaNacimiento;
                    nuevoUsuarioEspecializado.genero = req.body.genero;
                    nuevoUsuarioEspecializado.pApellido = req.body.pApellido;
                    nuevoUsuarioEspecializado.sApellido = req.body.sApellido;
                }
                return new User(nuevoUsuarioEspecializado).save();
            }
        }).then(function (result) { //LO QUE ME PASA AL RESULT ES EL OBEJTO GUARDADO EN FORMATO JSON
            if (result != null) {
                //ESTAS VARIABLES DE AQUÍ ME GENERAN UN CODIGO ALEATORIO QUE SE ENVÍA AL CORREO
                //FUNCIÓN PARA ENVIAR CORREO ELECTRÓNICOS/////////////////////////////////////////////////////////////
                // var transporter = nodemailer.createTransport({
                //     host: 'mail.pjimenezcr.com',
                //     port: 587,
                //     secure: false,
                //     auth: {
                //         user: 'noobdevs@pjimenezcr.com',
                //         pass: 'contraseña'
                //     },
                //     tls: {
                //         rejectUnauthorized: false
                //     }
                // });
                // var mailOptions = {
                //     from: 'noobDevs@gmail.com',
                //     to: req.body.correo,
                //     subject: 'Código de verificación',
                //     text: "Ingresa este código de verificación para crear tu contraseña: " + result.contrasena
                // };
                // transporter.sendMail(mailOptions, function (error, info) {
                //     if (error) {
                //         console.log(error);
                //     } else {
                //         console.log('Email enviado: ' + info.response);
                //     }
                // });
            }
            return res.status(201).json({
                statusCode: 201,
                message: 'Se registro con exito el usario',
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

router.put('/disable/:userEmail', (req, res, next) => {
    const { userEmail } = req.params;
    const valuesToUpdate = Object.keys(req.body)
        .filter(key => key !== 'email' && key !== '_id' && key !== 'contrasena')
        .map(key => req.body[key]);
    User.updateOne({ email: userEmail }, { ...valuesToUpdate })
        .then(data => {

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
});

router.delete('/delete/:userEmail', (req, res, next) => {
    const { userEmail } = req.params;
    User.deleteOne({ email: userEmail })
        .then(data => {
            if (data.deletedCount < 1) {
                const errorNoMatch = new Error('No puede eliminar un usuario que no exite en el sistema');
                errorNoMatch.statusCode = 404;
                throw errorNoMatch;
            }
            return res.status(201).json({
                statusCode: 201,
                message: `Se elimino con exito el usuario: ${userEmail}`
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
});

router.get('/search/:searchVal', (req, res, next) => {
    const { searchVal } = req.params;
    if (searchVal === 'null') {
        return res.redirect('/users')
    };
    const searchHelper = genericQuery.searchAgregtHelper(User, searchVal, {
        _id: 0,
        contrasena: 0
    });
    User.aggregate([
        { '$addFields': searchHelper.addFields },
        { '$project': searchHelper.projectReduce },
        { '$project': searchHelper.projectShowFields },
        { '$match': searchHelper.match }
    ])
        .then(docs => {
            if (docs.length === 0) {
                const error = new Error('No se encontaron usuarios con esa descripción');
                error.statusCode = '404';
                throw error;
            }
            return res.status(201).json({
                statusCode: 201,
                message: 'Se encontraron usuarios, con la desccripción: ' + searchVal,
                data: docs
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
});

router.get('/', (req, res, next) => {
    const projecToReduceArray = {};
    User.schema.eachPath((docKey, schem) => {
        if (schem.instance === 'Array') {
            projecToReduceArray[docKey] = {
                '$reduce': {
                    input: '$' + docKey,
                    initialValue: '',
                    in: { '$concat': ['$$value', '$$this'] }
                }
            }
        } else {
            projecToReduceArray[docKey] = 1;
        }
    });
    console.log(projecToReduceArray);

    User.aggregate()
        .project({ _id: 0, __v: 0, 'contrasena': 0 })
        .project(projecToReduceArray)
        .then(data => {
            if (data.length < 1) {
                const emptyErr = new Error('No se obtuvieron resultados');
                res.statusCode = 404;
                throw emptyErr;
            }
            data.forEach(u => {

                u.status = u.status ? 'Habilitado' : 'Deshabilitado';
            });

            return res.status(201).json({
                statusCode: 201,
                message: 'Usuarios obtenidos con exito!',
                data: data
            });
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
});

module.exports = router;