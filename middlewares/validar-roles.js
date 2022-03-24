const { request, response } = require("express");


const esAdminRole = (req = request, res = response, next) => {
    if(!req.usuario){
        return res.status(500).json({
            msg: 'No se tiene usuario para validar el rol'
        });
    }

    const {rol, nombre} = req.usuario;

    if(rol !== 'ADMIN_ROL'){
        return res.status(401).json({
            msg: 'No tiene permiso para realizar esta acción'
        });
    }
}

const tieneRol = (...roles) => {

    return (req = request, res = response, next) => {
        const {rol, nombre} = req.usuario;
        if(!req.usuario){
            return res.status(500).json({
                msg: 'No se tiene usuario para validar el rol'
            });
        }
        if(!roles.includes(rol)){
            return res.status(401).json({
                msg: 'No tiene permiso para realizar esta acción'
            });
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRol
}