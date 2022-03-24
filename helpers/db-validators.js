const Role = require('../models/rol')
const Usuario = require('../models/usuario');
const bCryptjs = require('bcryptjs');

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
    }
};

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${correo} ya esta registrado en la base de datos`);
    }
}

const usuarioEliminado = async (correo = '') => {
    const usuarioActivo = await Usuario.findOne({correo, estado: true});
    if(!usuarioActivo) {
        throw new Error(`Usuario o password no valido`);
    }
}

const validaPassword = async (correo = '', password = '') => {
    const usuarioActivo = await Usuario.findOne({correo, estado: true});
    const validPassword = bCryptjs.compareSync(password, usuarioActivo.password);
    if(!validPassword) {
        throw new Error(`Usuario o password no valido`);
    }
}

const usuarioExisteById = async (id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El usuario ${id} no existe en la base de datos`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    usuarioExisteById,
    usuarioEliminado,
    validaPassword
};