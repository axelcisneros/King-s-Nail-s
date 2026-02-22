import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/HomePage/HomePage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';


const AppRouter = () => {
  return (
    <Routes>
      {/* Todas las rutas anidadas aquí se renderizarán dentro del Layout */}
      <Route path="*" element={<Layout />}>
        {/* La página de inicio es la ruta índice del layout */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* Aquí añadiremos más rutas después: /galeria, etc. */}
      </Route>
    </Routes>
  );
};

export default AppRouter;