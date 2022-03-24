const { request, response } = require('express');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if(!token) {
        return res.status(401).json({
            msg: 'No se ha enviado un token valido'
        });
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        req.uid = uid;
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                msg: 'No se ha enviado un token valido'
            });
        }
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'No se ha enviado un token valido'
            });
        }
        req.usuario = usuario
        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'No se ha enviado un token valido'
        });
    }
}

module.exports = {
    validarJWT
}