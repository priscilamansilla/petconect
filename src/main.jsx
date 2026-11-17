import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { PetProvider } from './context/PetContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { FavoritesProvider } from './context/FavoritesContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PetProvider>
          <ApplicationProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </ApplicationProvider>
        </PetProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
