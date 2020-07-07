const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/usuario');
const config = require('../util/config');

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('Este correo no tiene un a cuenta registrada');
                error.statusCode = 401;
                error.data = { email: email };
                throw error;
            }
            return user;
        })
        .then(user => {
            if (user.contrasena !== password) {
                const error = new Error('Contraseña ingresada es incorrecta');
                error.statusCode = 401;
                error.data = { password: password };
                throw error;
            }
            const token = jwt.sign(
                {
                    email: email,
                    type: user.type
                }
                , config.secret
                , {
                    expiresIn: '2h' //60 * 60 * 1000
                }
            );
            const expiresTime = new Date().getTime() + (2 * 60 * 60 * 1000);
            console.log(user.tipo);

            res.status(200).json({
                statusCode: 200,
                message: 'Inicio de sesion exitoso',
                data: {
                    nombre: user.nombre,
                    pApellido: user.pApellido,
                    profilePicture: user.profilePicture,
                    correo: user.email,
                    tipo: user.tipo,
                    token: token,
                    expiresTime: expiresTime
                }
            });
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;
            res.json({
                statusCode: err.statusCode,
                message: err.message,
                data: err.data
            });
        });
});

module.exports = router;