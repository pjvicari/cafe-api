const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    try {
        if(!token) {
            throw new Error('No se ha enviado un token valido');
        }
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        req.uid = uid;
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            throw new Error('No se ha enviado un token valido');
        }
        if (!usuario.estado) {
            throw new Error('No se ha enviado un token valido');
        }
        req.usuario = usuario
        next();
    } catch (error) {
        return res.status(401).json({errors: [{
            msg: error.message,
            param: "token",
            location: "header"
        }]});
    }
}

module.exports = {
    validarJWT
}