const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Tarjeta = require('../models/tarjeta');
const util = require('../util/util');
const genericQuery = require('../util/genericQueriesHelper');

router.post('/add', (req, res, next) => {
    const { numeroTarjeta, dueno } = req.body;
    console.log(req.body);

    Tarjeta.findOne({ numeroTarjeta: numeroTarjeta })
        .then(result => {
            if (result) {
                const consFound = new Error('Esta tarjeta ya se encuentra registrada')
                consFound.statusCode = 409;
                throw consFound;
            }
            return new Tarjeta({ ...req.body, _id: mongoose.Types.ObjectId() }).save();
        })
        .then(result => {
            return res.status(201).json({
                statusCode: 201,
                message: 'Tarjeta añadida con exito al usuario ' + dueno,
                data: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

});

router.put('/edit', (req, res, next) => {

});

router.get('/:userId', (req, res, next) => {
    const { userId } = req.params;
    Tarjeta.find({ dueno: userId })
        .select('-__v')
        .then(result => {
            if (result.length < 1) {
                const notFoundErr = new Error('Este usuario no tiene tarjetas registrdas');
                notFoundErr.statusCode = 404;
                throw notFoundErr;
            }
            const dataToSend = [];
            result.forEach(card => {
                let newCard = { ...card._doc };
                Object.keys(newCard).forEach(key => {
                    if (key === 'marca') {
                        newCard[key] = newCard[key][0];
                    }
                });
                dataToSend.push(newCard);
            });
            return res.status(200).json({
                statusCode: 200,
                message: 'Se encontraron las taejtas con exito',
                data: dataToSend
            })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
});

router.get('/:userName/search/:sValue', (req, res, next) => {
    const { sValue, userName } = req.params;
    const searchHelper = genericQuery.searchAgregtHelper(Tarjeta, sValue, {
        _id: 0
    });
    if (sValue === 'null') return res.redirect(`/tarjetas/${userName}`);
    Tarjeta.aggregate()
        .addFields({ ...searchHelper.addFields })
        .project({ ...searchHelper.projectReduce })
        .project({ ...searchHelper.projectShowFields })
        .match({ ...searchHelper.match })
        .match({ dueno: userName })
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

module.exports = router;