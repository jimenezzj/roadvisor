const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    numeroCedula: Number,
    nombre: String,
    pApellido: String,
    sApellido: String,
    tipo: ["ruta"],
    email: String,
    genero: ['femenino', 'masculino', 'otro'],
    fechaNacimiento: Date,
    contrasena: String,
    profilePicture: String,
    status: String,
    conductor: {
        type: mongoose.Types.ObjectId,
        ref: 'Usuario'
    }
});


module.exports = mongoose.model('Usuario', usuarioSchema, 'Usuarios');