import { Router } from 'express';
// import { getTestPersonality } from '../controllers/TestController.js';
import { getTestPersonality, getRespuestasActivas, iniciarTest, verificarTest, guardarRespuestas, obtenerUsuariosConTest, eliminarTestNoCompletado, postRespuestas, obtenerTestsCompletados, getDashboardResumen, verificarTestCompletado, pdf} from '../controllers/TestController.js';
import { obtenerPuestosRecomendados, verificarTestPendiente } from '../controllers/AuthController.js';

const testRoutes = Router();

testRoutes.get('/get', getTestPersonality);
testRoutes.get('/getRespuestasActivas', getRespuestasActivas);
testRoutes.post('/crearTest', iniciarTest);
testRoutes.post('/verificarTest', verificarTest);
testRoutes.delete('/eliminarTest', eliminarTestNoCompletado)
testRoutes.post('/llenarTest',  postRespuestas)
testRoutes.get('/completados', obtenerTestsCompletados)
testRoutes.post('/guardar-respuestas', guardarRespuestas);
testRoutes.get('/resumenDashboard', getDashboardResumen)
testRoutes.get('/usuarios-con-test', obtenerUsuariosConTest);
testRoutes.get('/verificar-test-completado/:idUsuario', verificarTestCompletado);
testRoutes.get('/verificar-pendiente/:idUsuario', verificarTestPendiente);
testRoutes.get('/puestos/:id',obtenerPuestosRecomendados);
testRoutes.get('/generar-pdf/:idUsuarioTest',pdf)










export default testRoutes;
