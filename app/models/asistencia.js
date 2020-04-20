const mongoose = require('mongoose');

const schemaAsistencias = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    usuarioEspecializado: mongoose.Types.ObjectId,
    usuarioTradicional: mongoose.Types.ObjectId,
    status: ['P', 'A', 'C'],// pendiente, activo, cerrado
    calificacion: Number,
    ruta: mongoose.Types.ObjectId,
    comentarioAsistencia: String,
    direccion: String
});

module.exports = mongoose.model('Asistencia', schemaAsistencias);