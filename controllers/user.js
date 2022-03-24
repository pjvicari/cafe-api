const {response, request} = require('express');
const Usuario = require('../models/usuario');
const bCryptjs = require('bcryptjs');

const usuariosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0} = req.query;
    const estado = true;
    

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({estado}),
        Usuario.find({estado})
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    
    const mostrados = usuarios.length;
    res.json({
        ok: true,
        mostrados,
        total,
        usuarios
    });
};

const usuariosPost = async (req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol});

    //encriptar la contraseña
    const salt = bCryptjs.genSaltSync();
    usuario.password = bCryptjs.hashSync(password, salt);
    //Guardar en BD
    await usuario.save();
    res.json({
        ok: true,
        msg: 'post ',
        usuario
    });
};

const usuariosPut = async (req, res = response) => {
    const {id} = req.params;
    const {_id, password, google, correo, ...resto } = req.body;

    if(password) {
        const salt = bCryptjs.genSaltSync();
        resto.password = bCryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        ok: true,
        msg: 'put ',
        usuario
    });
};

const usuariosDelete = async (req, res = response) => {
    const {id} = req.params;
    const usuarioAutenticado = req.usuario;
    //borrar fisicamente de la BD
    //const usuario = await Usuario.findOneAndDelete(id);
    //cambiando estado del Usuario
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    res.json({
        ok: true,
        usuario,
        usuarioAutenticado
    });
};

const usuariosPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'patch '
    });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}