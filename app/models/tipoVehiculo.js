var mongoose = require('mongoose');

var tipoVehiculoSchemas = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    nombreTipoVehiculo: {
        type: String,
        require: true
    },

    iconoTipoVehiculo: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true
    }
});

module.exports = mongoose.model('TipoVehiculo', tipoVehiculoSchemas, 'TipoVehiculos');