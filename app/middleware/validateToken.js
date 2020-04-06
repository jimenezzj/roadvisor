const jwt = require('jsonwebtoken');
const config = require('../util/config')

const validateToken = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                const invalidToken = new Error('Invalid token');
                invalidToken.statusCode = 403;
                throw invalidToken;
            }
            req.email = decoded.email;
            req.tipe = decoded.type;
            next();
        });
    } else {
        const noTokenError = new Error('No se puede autenticar, no se envio el token');
        noTokenError.statusCode = 401;
        throw noTokenError;
    }
};

module.exports = {
    validateToken
}