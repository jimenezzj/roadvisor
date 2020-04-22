const mongoose = require('mongoose');

const asistenciaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectID,
    nombre: {
        type: String,
        require: true
    },
    icono: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    }
});

module.exports = mongoose.model('TipoAsistencia', asistenciaSchema, 'TipoAsistencias');