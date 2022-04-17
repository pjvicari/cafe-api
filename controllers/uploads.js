const { response } = require("express");
const { request } = require("express");
const path = require('path');
const { Schema } = require("mongoose");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");
const fs = require("fs");


const cargarArchivo = async(req = request, res = response) => {

    try {
        const archivoSubido = await subirArchivo(req.files);
        res.json({archivo: archivoSubido});
    } catch (error) {
        res.status(400).json({msg: error});
    }
}

const actualizarImagen = async(req = request, res = response) => {

    const {id, coleccion} = req.params;
    let modelo;
    
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: 'No existe el usuario'
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: 'No existe el usuario'
                })
            }
            break;
        default:
            return res.status(500).json({msg: 'No se validó esta opción'})
            break;
    }

    //limpiar imagenes previas
    try {
        if(modelo.img) {
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if(fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen);
            }
        }
    } catch (error) {
        
    }
    modelo.img = await subirArchivo(req.files, undefined, coleccion);
    await modelo.save();
    res.json(modelo);
}

const getImage = async(req = request, res = response) => {
    const {id, coleccion} = req.params;
    let modelo;
    
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: 'No existe el usuario'
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: 'No existe el usuario'
                })
            }
            break;
        default:
            return res.status(500).json({msg: 'No se validó esta opción'})
    }

    try {
        if(modelo.img) {
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if(fs.existsSync(pathImagen)) {
                res.sendFile(pathImagen);
            }
        }
        else
        {
            const pathImagen = path.join(__dirname, '../assets','', 'no-image.jpg');
            res.sendFile(pathImagen);
        }
    } catch (error) {
        
    }
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    getImage
}