const {response, request} = require('express');

const usuariosGet = (req = request, res = response) => {
    const query = req.query;
    res.json({
        ok: true,
        msg: 'get ',
        query
    });
};

const usuariosPost = (req, res = response) => {
    const body = req.body;
    res.json({
        ok: true,
        msg: 'post ',
        body
    });
};

const usuariosPut = (req, res = response) => {
    const id = req.params.id;
    res.json({
        ok: true,
        msg: 'put ',
        id
    });
};

const usuariosDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'delete '
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