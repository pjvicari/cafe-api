const { Router } = require('express');
const { check } = require('express-validator');
const { categoriaGet, categoriasGet, categoriasPost, categoriasPut, categoriasDelete } = require('../controllers/categorias');
const { validarJWT, validarCampos, tieneRol } = require('../middlewares');
const {categoriaExiste, categoriaExisteById} = require('../helpers/db-validators');

const router = Router();

//obtener las categorias
router.get('/',categoriasGet);
//obtener una categoria
router.get('/:id', [
    check('id', 'no es un id valido').isMongoId(),
    validarCampos
],categoriaGet);
//metodo privado para crear categoria
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(categoriaExiste), 
    validarCampos
],categoriasPost);
//metodo privado para actualizar categoria
router.put('/:id', [
    validarJWT,
    check('id', 'no es un id valido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(categoriaExiste), 
    validarCampos
],categoriasPut);
//metodo delete categoria
router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN_ROL', 'SUPER_ROLE'),
    check('id', 'No es un ID valido').isMongoId(), 
    check('id').custom(categoriaExisteById), 
    validarCampos
],categoriasDelete);

module.exports = router;