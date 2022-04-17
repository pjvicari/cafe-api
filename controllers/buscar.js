const { response } = require("express");
const { request } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto, Role} = require('../models');
const coleccionesPermitidas = [
    'usuarios',
    'productos',
    'categorias',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: usuario ? [usuario] : []
        })
    }

    const regexp = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{nombre: regexp}, {correo: regexp}],
        $and: [{estado: true}]
    });
    return res.json({
        results: usuarios
    })
}

const buscarProductos = async( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: producto ? [producto] : []
        })
    }

    const regexp = new RegExp(termino, 'i');

    const productos = await Producto.find({
        $or: [{nombre: regexp}, {descripcion: regexp}],
        $and: [{estado: true}]
    }).populate('categoria', 'nombre');
    return res.json({
        results: productos
    })
}

const buscarCategoria = async( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: categoria ? [categoria] : []
        })
    }

    const regexp = new RegExp(termino, 'i');

    const categorias = await Categoria.find({
        $or: [{nombre: regexp}],
        $and: [{estado: true}]
    });
    return res.json({
        results: categorias
    })
}

const buscarRoles = async( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID) {
        const rol = await Role.findById(termino);
        return res.json({
            results: rol ? [rol] : []
        })
    }

    const regexp = new RegExp(termino, 'i');

    const roles = await Role.find({
        $or: [{rol: regexp}]
    });
    return res.json({
        results: roles
    })
}

const buscar = (req = request, res = response) => {
    const { coleccion, termino } = req.params;
    if(!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: 'La colección no es permitida'
        });
    }
    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;
        case 'categorias':
            buscarCategoria(termino, res);
        break;
        case 'roles':
            buscarRoles(termino, res);
        break;
        default:
            res.status(400).json({
                msg: 'No encontrada'
            })
    }
    
}

module.exports = {
    buscar
}