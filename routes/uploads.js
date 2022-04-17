const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, getImage } = require('../controllers/uploads');
const { validarColeccionesPermitidas } = require('../helpers/db-validators')
const { validarCampos, validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post('/', [
        validarArchivoSubir,
        validarCampos
    ],
    cargarArchivo);

router.post('/:coleccion/:id', [
        validarArchivoSubir,
        check('id', 'El id debe ser un id de mongo').isMongoId(),
        check('coleccion').custom(c => validarColeccionesPermitidas(c, ['usuarios', 'productos'])),
        validarCampos
    ],
    actualizarImagen);

router.get('/:coleccion/:id', [
        check('id', 'El id debe ser un id de mongo').isMongoId(),
        check('coleccion').custom(c => validarColeccionesPermitidas(c, ['usuarios', 'productos'])),
        validarCampos
    ],
    getImage);

module.exports = router;