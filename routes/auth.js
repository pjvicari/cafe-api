const { Router } = require('express');
const { check } = require('express-validator');
const {login, googleSignIn} = require('../controllers/auth');
const { usuarioEliminado } = require('../helpers/db-validators');
const { validarCampos, validaPassword } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('correo').custom(usuarioEliminado),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);

router.post('/google', [
    check('id_token', 'El token es obligatorio').not().isEmpty(),
    validarCampos
],googleSignIn);

module.exports = router;