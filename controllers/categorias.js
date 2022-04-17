const {response, request} = require('express');
const { Categoria } = require('../models');

//populate

const categoriasGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0} = req.query;
    const estado = true;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({estado}),
        Categoria.find({estado})
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    
    const mostradas = categorias.length;
    res.json({
        ok: true,
        mostradas,
        total,
        categorias
    });
};
//populate
const categoriaGet = async (req = request, res = response) => {
    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate();
    if(!categoria){
        return res.status(404).json({
            ok: false,
            msg: 'no existe la categoria'
        });    
    }
    res.json({
        ok: true,
        categoria
    });
};

const categoriasPost = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});
    if (categoriaDB) {
        return res.status(400).json({
            ok: false,
            msg: 'Ya existe este categoria'
        })
    }
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await Categoria(data);
    await categoria.save();
    res.status(201).json({
        ok: true,
        categoria
    });
};

const categoriasPut = async (req = request, res = response) => {
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();
    const {estado, usuario, ...data} = req.body;

    const [categoriaDB] = await Promise.all([
        Categoria.findById(id)
    ]);
    if (!categoriaDB) {
        return res.status(400).json({
            ok: false,
            msg: 'No existe esta categoria'
        })
    }
    
    categoriaDB.nombre = nombre;
    await categoriaDB.save();
    res.status(200).json({
        ok: true,
        categoria: categoriaDB
    });
};

const categoriasDelete = async (req = request, res = response) => {
    const {id} = req.params;
    const usuarioAutenticado = req.usuario;
    //borrar fisicamente de la BD
    //const usuario = await Usuario.findOneAndDelete(id);
    //cambiando estado del Usuario
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false});
    res.json({
        ok: true,
        categoria,
        usuarioAutenticado
    });
};

module.exports = {
    categoriasGet,
    categoriaGet,
    categoriasPost,
    categoriasPut,
    categoriasDelete
}