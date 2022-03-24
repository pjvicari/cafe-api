const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {
        const payload = {uid};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, resp) => {
            if(err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(resp);
            }
        })
    });
}

module.exports = {
    generarJWT
}