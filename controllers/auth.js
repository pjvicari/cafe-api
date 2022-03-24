const { response, request } = require("express");
const Usuario = require('../models/usuario');
const bCryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req = request, res = response) => {
    const {correo, password} = req.body;
    try {

        //Valida contraseña
        const usuarioActivo = await Usuario.findOne({correo, estado: true});
        const validPassword = bCryptjs.compareSync(password, usuarioActivo.password);
        if(!validPassword) {
            return res.status(400).json({msg: `Usuario o password invalido`});
        }

        //Generar JWT
        const token = await generarJWT(usuarioActivo.id);

        res.json({
            usuarioActivo,
            token
        });   
    } catch (error) {
        return res.status(500).json({msg: `error interno: ${error}`});
    }
}

const googleSignIn = async (req= request, res = response) => {
    const { id_token } = req.body;
    try {
        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario) {
            //crear el usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE',
                estado: true
            }
            usuario = new Usuario(data);
            await usuario.save();
        }

        //verificar usuario activo
        if (!usuario.estado) {
            res.status(401).json({
                ok: false,
                msg: 'Usuario bloqueado'
            })
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar',
            error
        })
    }
}

module.exports = {
    login,
    googleSignIn
}