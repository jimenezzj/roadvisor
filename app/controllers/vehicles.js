const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle');
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
    const { numeroPlaca, model, anio, color, type } = req.body;
    const vehiclePictures = [req.files[0].path];
    const newVehicle = new Vehicle({
        numeroPlaca: numeroPlaca,
        model: model,
        anio: anio,
        color: color,
        type: type,
        fotos: vehiclePictures
    });
    return res.status(201).json({
        statusCode: 201,
        message: 'Vehicle agregado con exito!',
        fields: newVehicle
    });
});

module.exports = router;