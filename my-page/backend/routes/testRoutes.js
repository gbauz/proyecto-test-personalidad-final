import { Router } from 'express';
// import { getTestPersonality } from '../controllers/TestController.js';
import { getTestPersonality, getRespuestasActivas, iniciarTest, verificarTest, guardarRespuestas, obtenerUsuariosConTest, eliminarTestNoCompletado, postRespuestas, obtenerTestsCompletados, getDashboardResumen, verificarTestCompletado} from '../controllers/TestController.js';
import { verificarTestPendiente } from '../controllers/AuthController.js';

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








export default testRoutes;
