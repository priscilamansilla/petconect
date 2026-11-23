import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// HashRouter y no BrowserRouter: las direcciones llevan un # (por ejemplo
// index.html#/mascotas). Eso es lo que permite que la carpeta dist funcione
// abriendola con doble clic, sin tener que levantar un servidor.
import { HashRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { PetProvider } from './context/PetContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { FavoritesProvider } from './context/FavoritesContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <PetProvider>
          <ApplicationProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </ApplicationProvider>
        </PetProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
);
