const mongoose = require('mongoose');

const vehiclesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    numeroPlaca: String,
    marca: String,
    modelo: String,
    anio: Date,
    color: String,
    type: String,
    fotos: [String],
    usuario: {
        required: true,
        type: String,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Vehiculo', vehiclesSchema, 'Vehiculos');