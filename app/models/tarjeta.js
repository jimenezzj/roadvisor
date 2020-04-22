const mongoose = require('mongoose');

const tarjetSchema = mongoose.Schema({
    "_id": mongoose.Schema.Types.ObjectId,
    "numeroTarjeta": String,
    "nombreTitular": String,
    "cvv": Number,
    "fechaVencimiento": Date,
    "marca": ["visa", "mastercard", "americanexpress", "discover"],
    "pais": String,
    "dueno": {
        type: String,
        require: true,
        ref: "Usuario"
    }
}); 

module.exports = mongoose.model('Tarjeta', tarjetSchema, 'Tarjetas');