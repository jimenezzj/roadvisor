var mongoose = require('mongoose');

var reportarSiniestro = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    tipoSiniestroReportado: {
        type: String,
        require: true
    },

    rutaSiniestroReportado: {
        type: String,
        require: true
    },
    fotoSiniestroReportado: {
        type: String,
        require: true
    },
    direccionSiniestroReportado: {
        type: String,
        require: true
    },
    descripcionSiniestroReportado: String
});

module.exports = mongoose.model('Siniestro', reportarSiniestro, 'Siniestros');