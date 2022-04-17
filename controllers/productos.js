const {response, request} = require('express');
const { Producto } = require('../models');

//populate

const productosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0} = req.query;
    const estado = true;

    const [total, productos] = await Promise.all([
        Producto.countDocuments({estado}),
        Producto.find({estado})
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    
    const mostrados = productos.length;
    res.json({
        ok: true,
        mostrados,
        total,
        productos
    });
};
//populate
const productoGet = async (req = request, res = response) => {
    const {id} = req.params;
    const producto = await Producto.findById(id).populate();
    try {
        if(!producto){
            throw new Error('No existe el producto');
        }
    } catch (error) {
        return res.status(400).json(error);
    }
    
    res.json({
        ok: true,
        producto
    });
};

//Productos en una categoria
const productosByCategoriaGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0} = req.query;
    const estado = true;
    const {id} = req.params;

    const [total, productos] = await Promise.all([
        Producto.countDocuments({estado, categoria: id}),
        Producto.find({estado, categoria: id})
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    
    const mostrados = productos.length;
    res.json({
        ok: true,
        mostrados,
        total,
        productos
    });
};

const productoPost = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const {descripcion, precio, categoria, disponible} = req.body;

    const data = {
        nombre,
        descripcion,
        precio,
        categoria,
        disponible,
        usuario: req.usuario._id
    }

    const producto = await Producto(data);
    await producto.save();
    res.status(201).json({
        ok: true,
        producto
    });
};

const productoPut = async (req = request, res = response) => {
    const {id} = req.params;
    const nombre = '';
    if(req.body.nombre){
        nombre = req.body.nombre.toUpperCase();
    }
    const {descripcion, precio, categoria, disponible, ...data} = req.body;

    const [productoDB] = await Promise.all([
        Producto.findById(id)
    ]);
    
    try {
        if (!productoDB) {
            throw new Error('No existe esta producto');
        }
    } catch (error) {
        return res.status(400).json(error);
    }
    if(nombre !== ''){
        productoDB.nombre = nombre;
    }
    productoDB.descripcion = nombre;
    productoDB.precio = precio;
    productoDB.categoria = categoria;
    productoDB.disponible = disponible;
    await productoDB.save();
    res.status(200).json({
        ok: true,
        productoDB
    });
};

const productoDelete = async (req = request, res = response) => {
    const {id} = req.params;
    const usuarioAutenticado = req.usuario;
    //borrar fisicamente de la BD
    //const usuario = await Usuario.findOneAndDelete(id);
    //cambiando estado del Usuario
    const producto = await Producto.findByIdAndUpdate(id, {estado: false});
    res.json({
        ok: true,
        producto,
        usuarioAutenticado
    });
};

module.exports = {
    productosGet,
    productoGet,
    productosByCategoriaGet,
    productoPost,
    productoPut,
    productoDelete,
}