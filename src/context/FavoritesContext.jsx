import { createContext, useContext } from 'react';
import { favoritos as favoritosIniciales } from '../data/applications';
import { useAuth } from './AuthContext';
import { useEstadoGuardado } from '../hooks/useEstadoGuardado';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favoritos, setFavoritos] = useEstadoGuardado(
    'favoritos',
    favoritosIniciales,
  );
  const { usuarioActual } = useAuth();

  function esFavorito(mascotaId) {
    if (!usuarioActual) return false;
    return favoritos.some(
      (f) =>
        f.usuarioId === usuarioActual.id && f.mascotaId === Number(mascotaId),
    );
  }

  // RN18: un usuario autenticado y activo puede agregar o quitar favoritos,
  // y la misma mascota no puede aparecer duplicada en su lista.
  function alternarFavorito(mascotaId) {
    if (!usuarioActual || !usuarioActual.activo) return;
    const id = Number(mascotaId);
    setFavoritos((actuales) =>
      actuales.some(
        (f) => f.usuarioId === usuarioActual.id && f.mascotaId === id,
      )
        ? actuales.filter(
            (f) => !(f.usuarioId === usuarioActual.id && f.mascotaId === id),
          )
        : [...actuales, { usuarioId: usuarioActual.id, mascotaId: id }],
    );
  }

  function favoritosDelUsuario() {
    if (!usuarioActual) return [];
    return favoritos
      .filter((f) => f.usuarioId === usuarioActual.id)
      .map((f) => f.mascotaId);
  }

  const valor = {
    favoritos,
    esFavorito,
    alternarFavorito,
    favoritosDelUsuario,
  };

  return (
    <FavoritesContext.Provider value={valor}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const contexto = useContext(FavoritesContext);
  if (!contexto)
    throw new Error(
      'useFavorites tiene que usarse dentro de <FavoritesProvider>',
    );
  return contexto;
}
