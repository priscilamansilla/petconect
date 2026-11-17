import { createContext, useContext } from 'react';
import { usuarios as usuariosIniciales } from '../data/users';
import { ROLES } from '../data/options';
import { useEstadoGuardado } from '../hooks/useEstadoGuardado';

const AuthContext = createContext(null);

// En la maqueta arrancamos con una adoptante ya logueada para poder recorrer
// la aplicación sin pasar por el login. Cuando la autenticación esté hecha,
// esto arranca en null.
const SESION_INICIAL = 5;

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useEstadoGuardado(
    'usuarios',
    usuariosIniciales,
  );
  // Guardamos solo el id de quien está logueado, no el usuario entero: si
  // guardáramos una copia, al editar el perfil quedarían dos versiones
  // distintas del mismo usuario.
  const [usuarioActualId, setUsuarioActualId] = useEstadoGuardado(
    'sesion',
    SESION_INICIAL,
  );

  const usuarioActual =
    usuarios.find((u) => u.id === usuarioActualId) ?? null;

  // --- Lo que falta implementar (bloque de login y roles) -----------------

  // RN01: dar de alta un usuario validando que el correo no esté repetido.
  function registrar(datos) {
    console.warn('TODO registrar()', datos);
  }

  // RN04: un usuario desactivado no puede iniciar sesión.
  function iniciarSesion(email, password) {
    console.warn('TODO iniciarSesion()', email, password);
  }

  // -----------------------------------------------------------------------

  function cerrarSesion() {
    setUsuarioActualId(null);
  }

  // Actualiza los datos del usuario logueado. Lo usa la pantalla de perfil
  // para cambiar las preferencias con las que se calcula la compatibilidad.
  function actualizarPerfil(cambios) {
    if (!usuarioActual) return;
    setUsuarios((actuales) =>
      actuales.map((u) =>
        u.id === usuarioActual.id ? { ...u, ...cambios } : u,
      ),
    );
  }

  // Solo para la maqueta: permite cambiar de usuario desde el menú para ver
  // cómo se ve la aplicación con cada rol, sin tener que hacer login.
  function cambiarUsuarioDemo(id) {
    setUsuarioActualId(id === null ? null : Number(id));
  }

  const valor = {
    usuarios,
    setUsuarios,
    usuarioActual,
    estaAutenticado: Boolean(usuarioActual),
    esAdoptante: usuarioActual?.rol === ROLES.ADOPTANTE,
    esRefugio: usuarioActual?.rol === ROLES.REFUGIO,
    esAdmin: usuarioActual?.rol === ROLES.ADMIN,
    registrar,
    iniciarSesion,
    cerrarSesion,
    actualizarPerfil,
    cambiarUsuarioDemo,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto)
    throw new Error('useAuth tiene que usarse dentro de <AuthProvider>');
  return contexto;
}
