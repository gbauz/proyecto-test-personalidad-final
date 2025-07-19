import express from 'express';
import multer from 'multer';
import { login, register, getRoles, forgotPassword, contraseña, usuarios, } from '../controllers/AuthController.js';
import { UserController } from '../controllers/UserController.js';
import {  OfertaController } from '../controllers/OfertaController.js';
import { PerfilController } from '../controllers/PerfilController.js';

const router = express.Router();
const upload = multer({ dest: 'temp/' }); // directorio temporal

// Auth
router.post('/login', login);
router.post('/register', register);
router.get('/roles', getRoles);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',contraseña)
router.get('/user/:id',usuarios)

// Usuarios
router.get('/consultarusuarios', UserController.getUsuariosConRoles);
router.post('/consultarusuarios/update', UserController.updateUserStructured);
router.post('/consultarusuarios/delete', UserController.deleteUserStructured);

// Ofertas
router.post('/crearoferta', OfertaController.crearOferta);
router.get('/verofertas', OfertaController.obtenerOfertasParaPostulantes);
router.get('/fechas-con-usuario/:userId', OfertaController.getFechasConUsuario);
router.put('/postulacion/validar/:id', OfertaController.validarDocumento);
router.put('/postulacion/aprobar/:id', OfertaController.aprobarSolicitud);
router.get('/postulaciones/usuario/:id?', OfertaController.obtenerOfertaAplicadaPorUsuario);
router.get('/postulacion/estado/:id', OfertaController.obtenerEstadoAprobacion);
router.delete('/ofertas/:id', OfertaController.eliminarOferta);
router.put('/ofertas/:id', OfertaController.actualizarOferta);



// Perfil
router.get('/perfil/:userId', PerfilController.getPerfilByUserId);

// ✅ USAR .any() para soportar archivos + campos de texto (como name/email)
router.post('/perfil/update', upload.any(), PerfilController.updatePerfil);
router.post('/postular', OfertaController.postularAOferta);
router.get('/verificarpostulacion', OfertaController.verificarPostulacion);

export default router;
