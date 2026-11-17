import { createContext, useContext, useState } from 'react';
import { usuarios as usuariosIniciales } from '../data/users';
import { ROLES } from '../data/options';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  // En la maqueta arrancamos con una adoptante ya logueada para que se pueda
  // recorrer la aplicación sin pasar por el login. Cuando esté hecha la
  // autenticación de verdad, esto arranca en null.
  const [usuarioActual, setUsuarioActual] = useState(
    () => usuariosIniciales.find((u) => u.id === 5) ?? null,
  );

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
    setUsuarioActual(null);
  }

  // Actualiza los datos del usuario logueado. Lo usa la pantalla de perfil
  // para cambiar las preferencias con las que se calcula la compatibilidad.
  function actualizarPerfil(cambios) {
    if (!usuarioActual) return;
    const actualizado = { ...usuarioActual, ...cambios };
    setUsuarioActual(actualizado);
    setUsuarios((actuales) =>
      actuales.map((u) => (u.id === actualizado.id ? actualizado : u)),
    );
  }

  // Solo para la maqueta: permite cambiar de usuario desde el menú para ver
  // cómo se ve la aplicación con cada rol, sin tener que hacer login.
  function cambiarUsuarioDemo(id) {
    setUsuarioActual(usuarios.find((u) => u.id === Number(id)) ?? null);
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
