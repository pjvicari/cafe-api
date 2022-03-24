const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/user');
const { esRoleValido, emailExiste, usuarioExisteById } = require('../helpers/db-validators');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { tieneRol } = require('../middlewares/validar-roles');
const { validarCampos, validarJWT, esAdminRole, tieneRol } = require('../middlewares');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(usuarioExisteById),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('password', 'El password es requerido y más de 6 letras').isLength({ min: 6}),
    check('rol').custom(esRoleValido),
    validarCampos
] , usuariosPost);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN_ROL', 'SUPER_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(usuarioExisteById),    
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;