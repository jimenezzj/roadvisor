const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    numeroCedula: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    pApellido: String,
    sApellido: String,
    tipo: {
        type: String,
        enum: ['ruta', 'tradicional', 'servicio', 'admin'],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        enum: ['femenino', 'masculino', 'otro'],
        required: false,
        default: undefined
    },
    fechaNacimiento: Date,
    contrasena: {
        type: String,
        required: true
    },
    profilePicture: String,
    status: {
        required: true,
        type: String
    },
    telefono: {
        type: String,
        require: true
    },
    tipoEntidadJuridica: String,
    costo: Number,
    tipoServicio: String

});


module.exports = mongoose.model('Usuario', usuarioSchema, 'Usuarios');