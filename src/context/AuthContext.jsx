import { createContext, useContext } from 'react';
import { usuarios as usuariosIniciales } from '../data/users';
import { ROLES } from '../data/options';
import { useEstadoGuardado } from '../hooks/useEstadoGuardado';

const AuthContext = createContext(null);

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
    null,
  );

  const usuarioActual = usuarios.find((u) => u.id === usuarioActualId) ?? null;

  function buscarPorEmail(email) {
    const buscado = String(email).trim().toLowerCase();
    return usuarios.find((u) => u.email.toLowerCase() === buscado) ?? null;
  }

  // RN01: alta de un usuario. El correo tiene que ser único.
  // Quien se registra por su cuenta siempre entra como adoptante: las cuentas
  // de refugio y de administración las crea la administración (RN03).
  function registrar(datos) {
    if (buscarPorEmail(datos.email)) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    }

    const nuevo = {
      id: Math.max(0, ...usuarios.map((u) => u.id)) + 1,
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      email: datos.email.trim(),
      password: datos.password,
      ciudad: datos.ciudad,
      rol: ROLES.ADOPTANTE,
      activo: true,
      refugioId: null,
      preferencias: {
        especie: '',
        tamano: '',
        rangoEdad: '',
        sexo: '',
        ciudad: datos.ciudad,
      },
    };

    setUsuarios((actuales) => [...actuales, nuevo]);
    setUsuarioActualId(nuevo.id);
    return { ok: true, usuario: nuevo };
  }

  // RN04: un usuario desactivado no puede iniciar sesión.
  function iniciarSesion(email, password) {
    const usuario = buscarPorEmail(email);

    // El mismo mensaje para correo inexistente y contraseña equivocada, para
    // no revelar qué cuentas existen.
    if (!usuario || usuario.password !== password) {
      return { ok: false, error: 'El correo o la contraseña no coinciden.' };
    }

    if (!usuario.activo) {
      return {
        ok: false,
        error:
          'Esta cuenta está desactivada. Escribinos desde la página de contacto para reactivarla.',
      };
    }

    setUsuarioActualId(usuario.id);
    return { ok: true, usuario };
  }

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

  // --- Para el bloque de gestión de usuarios (Juana) ---------------------
  // Las dejo creadas acá para que no haya que tocar el resto del archivo.
  // La pantalla que las usa es src/pages/admin/AdminUsers.jsx.

  // RN04: desactivar una cuenta. Los registros históricos se conservan,
  // así que acá nunca se borra un usuario, solo se marca activo: false.
  function cambiarEstadoUsuario(id, activo) {
    console.warn('TODO cambiarEstadoUsuario()', id, activo);
  }

  // RN02 y RN03: cambiar el rol de una cuenta. Solo la administración puede.
  // Si se la pasa a refugio, hay que asignarle también un refugioId.
  function cambiarRolUsuario(id, rol, refugioId = null) {
    console.warn('TODO cambiarRolUsuario()', id, rol, refugioId);
  }

  // -----------------------------------------------------------------------

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
    buscarPorEmail,
    registrar,
    iniciarSesion,
    cerrarSesion,
    actualizarPerfil,
    cambiarEstadoUsuario,
    cambiarRolUsuario,
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

// A dónde va cada rol después de iniciar sesión.
export function inicioSegunRol(rol) {
  if (rol === ROLES.ADMIN) return '/admin';
  if (rol === ROLES.REFUGIO) return '/refugio';
  return '/mi-cuenta';
}
