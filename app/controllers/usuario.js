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
                const userToSend = { ...result._doc };
                userToSend.genero = userToSend.genero[0].toString();
                userToSend.tipo = userToSend.tipo[0].toString();
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