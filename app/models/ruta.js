var mongoose = require('mongoose');

var registrarRutaSchemas = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    status: Boolean,

    nombreRuta: { //REPRESENTA EL TIPO DE USUARIO
        type: String,
        require: true
    },
    provinciaRuta: {
        type: String,
        require: true
    },
    puntoInicio: {
        type: String,
        require: true
    },
    puntoFinal: {
        type: String,
        require: true
    },
    coordenadas: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Ruta', registrarRutaSchemas, 'Rutas');