import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
// import Dashboard from '../Features/Dashboard/Dashboard';
import MBTITest from '../Features/Begin/Inicio';
import Settings from '../Features/Settings/Settings';
import Register from '../Features/Auth/Register';
import MBTIQuestionPage from '../Features/Preguntas/Preguntas';
import AdminDashboardPage from '../Features/Begin/InicioAdministrador';
import Ofertaslaborales from '../Features/OfertasLaborales/OfertasLaborales';
import Faq from '../Features/Faq/Faq';
import ConsultarUsuario from '../Features/Auth/ConsultarUsuario';
import EstadoPostulacion from '../Features/Estado/EstadoPostulacion';
import OfertasPostulante from '../Features/Auth/OfertaPostulante';
import Postulacion from '../Features/OfertasLaborales/OfertasLaborales';
import FormularioOfertaFlowbite from '../Features/Auth/CrearOferta';
import Perfil from '../Features/Auth/Perfil';
import Vacante from '../Features/Auth/Vacante';
import TestList from '../Features/Preguntas/TestList';
import TestsLlenadosPage from '../Features/Preguntas/VerTest';

const PrivateRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    // Escucha cuando el login cambia (sin contexto)
    window.addEventListener('authChanged', handleAuthChange);

    // Limpieza del evento cuando el componente se desmonta
    return () => window.removeEventListener('authChanged', handleAuthChange);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
      >
        <Route path="dashboard" element={<MBTITest />} />
         <Route path="questions" element={<MBTIQuestionPage />} />
         <Route path="dashboardAdmin" element={<AdminDashboardPage />} />
        <Route path="register" element={<Register />} />
        <Route path="settings" element={<Settings />} />
         <Route path="consultarusuarios" element={<ConsultarUsuario />} />
        <Route path="ofertaslaborales" element={<Ofertaslaborales />} />
         <Route path="estadopostulacion" element={<EstadoPostulacion />} />
        <Route path="faq" element={<Faq />} />
         <Route path='/ofertaspostulante' element={<OfertasPostulante/>} />
        <Route path='/ofertas' element={< FormularioOfertaFlowbite />} /> 
        <Route path='/perfil' element={< Perfil />} /> 
        <Route path='/vacante' element={< Vacante />} /> 
         <Route path='/crearTest' element={< MBTIQuestionPage />} />
        <Route path='/verTest' element={< TestList />} />
      </Route>
    </Routes>
  );
};

export default PrivateRoutes;
