const { Router } = require('express');
const { check } = require('express-validator');
const { productosGet, productoGet, productoPost, productoPut, productoDelete, productosByCategoriaGet } = require('../controllers/productos');
const { validarJWT, validarCampos, tieneRol } = require('../middlewares');
const {productoExiste, productoExisteById, categoriaExisteById} = require('../helpers/db-validators');

const router = Router();

//obtener los productos
router.get('/',productosGet);
//obtener un producto
router.get('/:id', [
    check('id', 'no es un id valido').isMongoId(),
    validarCampos
],productoGet);
//obtener un producto por categoria
router.get('/categoria/:id', [
    check('id', 'no es un id valido').isMongoId(),
    check('id').custom(categoriaExisteById), 
    validarCampos
],productosByCategoriaGet);
//metodo privado para crear producto
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(productoExiste), 
    check('categoria').isMongoId(),
    check('categoria').custom(categoriaExisteById), 
    validarCampos
],productoPost);
//metodo privado para actualizar categoria
router.put('/:id', [
    validarJWT,
    check('id', 'no es un id valido').isMongoId(),
    check('id').custom(productoExisteById), 
    check('nombre').custom(productoExiste), 
    check('categoria').isMongoId(),
    check('categoria').custom(categoriaExisteById), 
    validarCampos
],productoPut);
//metodo delete categoria
router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN_ROL', 'SUPER_ROLE'),
    check('id', 'No es un ID valido').isMongoId(), 
    check('id').custom(productoExisteById), 
    validarCampos
],productoDelete);

module.exports = router;