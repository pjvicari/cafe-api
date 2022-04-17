const Role = require('../models/rol')
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
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

const categoriaExiste = async (nombre) => {
    nombre = nombre.toUpperCase();
    const categoria = await Categoria.findOne({nombre})
    if(categoria){
        throw new Error(`La categoria ${nombre} ya existe en la base de datos`);
    }
}

const categoriaExisteById = async (id) => {
    const categoria = await Categoria.findById(id)
    if(!categoria){
        throw new Error(`La categoria ${id} no existe en la base de datos`);
    }
}

const productoExiste = async (nombre) => {
    if(nombre){
        nombre = nombre.toUpperCase();
        const producto = await Producto.findOne({nombre})
        if(producto){
            throw new Error(`El producto ${nombre} ya existe en la base de datos`);
        }
    }
}

const productoExisteById = async (id) => {
    const producto = await Producto.findById(id)
    if(!producto){
        throw new Error(`El producto ${id} no existe en la base de datos`);
    }
}

const validarColeccionesPermitidas = (coleccion = '', colecciones = []) => {
    if(!colecciones.includes(coleccion)) {
        throw new Error(`La coleccion ${coleccion} no es permitida, colecciones permitidas ${colecciones}`);
    }
    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    usuarioExisteById,
    usuarioEliminado,
    validaPassword,
    categoriaExiste,
    categoriaExisteById,
    productoExiste,
    productoExisteById,
    validarColeccionesPermitidas
};