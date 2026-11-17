import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import RutaProtegida from './components/common/RutaProtegida';
import { ROLES } from './data/options';

import Home from './pages/public/Home';
import Pets from './pages/public/Pets';
import PetDetail from './pages/public/PetDetail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import NotFound from './pages/public/NotFound';

import AdopterDashboard from './pages/adopter/AdopterDashboard';
import Favorites from './pages/adopter/Favorites';
import MyApplications from './pages/adopter/MyApplications';
import Profile from './pages/adopter/Profile';

import ShelterDashboard from './pages/shelter/ShelterDashboard';
import ShelterPets from './pages/shelter/ShelterPets';
import ShelterApplications from './pages/shelter/ShelterApplications';
import ShelterProfile from './pages/shelter/ShelterProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminShelters from './pages/admin/AdminShelters';
import AdminPets from './pages/admin/AdminPets';
import AdminApplications from './pages/admin/AdminApplications';

// Atajo para no repetir el <RutaProtegida> en cada línea.
const soloAdoptante = (pagina) => (
  <RutaProtegida roles={[ROLES.ADOPTANTE]}>{pagina}</RutaProtegida>
);
const soloRefugio = (pagina) => (
  <RutaProtegida roles={[ROLES.REFUGIO]}>{pagina}</RutaProtegida>
);
const soloAdmin = (pagina) => (
  <RutaProtegida roles={[ROLES.ADMIN]}>{pagina}</RutaProtegida>
);

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Público */}
        <Route index element={<Home />} />
        <Route path="mascotas" element={<Pets />} />
        <Route path="mascotas/:id" element={<PetDetail />} />
        <Route path="nosotros" element={<About />} />
        <Route path="contacto" element={<Contact />} />
        <Route path="ingresar" element={<Login />} />
        <Route path="registrarme" element={<Register />} />

        {/* Adoptante */}
        <Route path="mi-cuenta" element={soloAdoptante(<AdopterDashboard />)} />
        <Route path="favoritos" element={soloAdoptante(<Favorites />)} />
        <Route
          path="mis-solicitudes"
          element={soloAdoptante(<MyApplications />)}
        />
        <Route path="perfil" element={soloAdoptante(<Profile />)} />

        {/* Refugio */}
        <Route path="refugio" element={soloRefugio(<ShelterDashboard />)} />
        <Route
          path="refugio/mascotas"
          element={soloRefugio(<ShelterPets />)}
        />
        <Route
          path="refugio/solicitudes"
          element={soloRefugio(<ShelterApplications />)}
        />
        <Route
          path="refugio/perfil"
          element={soloRefugio(<ShelterProfile />)}
        />

        {/* Administración */}
        <Route path="admin" element={soloAdmin(<AdminDashboard />)} />
        <Route path="admin/usuarios" element={soloAdmin(<AdminUsers />)} />
        <Route path="admin/refugios" element={soloAdmin(<AdminShelters />)} />
        <Route path="admin/mascotas" element={soloAdmin(<AdminPets />)} />
        <Route
          path="admin/solicitudes"
          element={soloAdmin(<AdminApplications />)}
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
