const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const User = require('../models/usuario');

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

router.get('/', (req, res) => {
    res.json({ message: 'successful request' });
});

router.post('/add', upload.single('profilePicture'), (req, res) => {
    // console.log(req.file);
    const user = {};
    Object.keys(req.body).forEach(userKey => {
        user[userKey] = req.body[userKey];

    });
    user.tipo = 'ruta';
    user.contrasena = '50m3*R4ND0M-p4s5wOr9';
    if (req.file) user.profilePicture = req.file.path;
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


module.exports = router;