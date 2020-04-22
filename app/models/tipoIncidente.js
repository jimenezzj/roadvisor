const mongoose = require('mongoose');

const tipoIncidente = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {
        type: String,
        require: true
    },
    icono: {
        type: String,
        // require: true
    },
    status: {
        type: Boolean,
        require: true
    }
});

module.exports = mongoose.model('TipoIncidente', tipoIncidente, 'TipoIncidentes');