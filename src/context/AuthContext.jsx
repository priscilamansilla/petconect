import { createContext, useContext, useEffect } from "react";
import { usuarios as usuariosIniciales } from "../data/users";
import { refugios } from "../data/shelters";
import { ROLES } from "../data/options";
import { useEstadoGuardado } from "../hooks/useEstadoGuardado";

const AuthContext = createContext(null);
const ROLES_VALIDOS = Object.values(ROLES);

function datosUsuarioValidos(datos) {
  const nombre = String(datos.nombre ?? "").trim();
  const apellido = String(datos.apellido ?? "").trim();
  const email = String(datos.email ?? "")
    .trim()
    .toLowerCase();
  const rol = datos.rol;

  if (!nombre || !apellido || !email || !String(datos.ciudad ?? "").trim()) {
    return { error: "Completá nombre, apellido, correo y ciudad." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { error: "Escribí un correo electrónico válido." };
  }
  if (!ROLES_VALIDOS.includes(rol)) {
    return { error: "Seleccioná un rol válido." };
  }
  if (rol === ROLES.REFUGIO) {
    const refugioId = Number(datos.refugioId);
    if (!refugios.some((refugio) => refugio.id === refugioId)) {
      return { error: "Seleccioná un refugio válido para esta cuenta." };
    }
  }

  return { nombre, apellido, email, ciudad: String(datos.ciudad).trim(), rol };
}

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useEstadoGuardado(
    "usuarios",
    usuariosIniciales,
  );
  // Guardamos solo el id de quien está logueado, no el usuario entero: si
  // guardáramos una copia, al editar el perfil quedarían dos versiones
  // distintas del mismo usuario.
  const [usuarioActualId, setUsuarioActualId] = useEstadoGuardado(
    "sesion",
    null,
  );

  const usuarioActual =
    usuarios.find((u) => u.id === usuarioActualId && u.activo) ?? null;

  // Si una cuenta queda inactiva o se elimina, invalida también la sesión
  // guardada en este navegador para que no vuelva a habilitarse al reactivarla.
  useEffect(() => {
    if (
      usuarioActualId !== null &&
      !usuarios.some((u) => u.id === usuarioActualId && u.activo)
    ) {
      setUsuarioActualId(null);
    }
  }, [usuarioActualId, usuarios, setUsuarioActualId]);

  function buscarPorEmail(email) {
    const buscado = String(email).trim().toLowerCase();
    return usuarios.find((u) => u.email.toLowerCase() === buscado) ?? null;
  }

  // RN01: alta de un usuario. El correo tiene que ser único.
  // Quien se registra por su cuenta siempre entra como adoptante: las cuentas
  // de refugio y de administración las crea la administración (RN03).
  function registrar(datos) {
    if (buscarPorEmail(datos.email)) {
      return { ok: false, error: "Ya existe una cuenta con ese correo." };
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
        especie: "",
        tamano: "",
        rangoEdad: "",
        sexo: "",
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
      return { ok: false, error: "El correo o la contraseña no coinciden." };
    }

    if (!usuario.activo) {
      return {
        ok: false,
        error:
          "Esta cuenta está desactivada. Escribinos desde la página de contacto para reactivarla.",
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

  function puedeGestionarUsuarios() {
    return usuarioActual?.rol === ROLES.ADMIN;
  }

  function crearUsuario(datos) {
    if (!puedeGestionarUsuarios()) {
      return {
        ok: false,
        error: "Solo la administración puede gestionar usuarios.",
      };
    }
    const validos = datosUsuarioValidos(datos);
    if (validos.error) return { ok: false, error: validos.error };
    if (usuarios.some((u) => u.email.trim().toLowerCase() === validos.email)) {
      return { ok: false, error: "Ya existe una cuenta con ese correo." };
    }
    if (!String(datos.password ?? "").trim()) {
      return {
        ok: false,
        error: "La contraseña es obligatoria para crear una cuenta.",
      };
    }

    const nuevo = {
      id: Math.max(0, ...usuarios.map((u) => u.id)) + 1,
      ...validos,
      password: datos.password,
      activo: datos.activo !== false,
      refugioId: validos.rol === ROLES.REFUGIO ? Number(datos.refugioId) : null,
      preferencias:
        validos.rol === ROLES.ADOPTANTE
          ? {
              especie: "",
              tamano: "",
              rangoEdad: "",
              sexo: "",
              ciudad: validos.ciudad,
            }
          : null,
    };
    setUsuarios((actuales) => [...actuales, nuevo]);
    return { ok: true, usuario: nuevo };
  }

  function actualizarUsuario(id, datos) {
    if (!puedeGestionarUsuarios()) {
      return {
        ok: false,
        error: "Solo la administración puede gestionar usuarios.",
      };
    }
    const existente = usuarios.find((u) => u.id === Number(id));
    if (!existente) return { ok: false, error: "No se encontró ese usuario." };

    const validos = datosUsuarioValidos(datos);
    if (validos.error) return { ok: false, error: validos.error };
    if (
      usuarios.some(
        (u) =>
          u.id !== existente.id &&
          u.email.trim().toLowerCase() === validos.email,
      )
    ) {
      return { ok: false, error: "Ya existe una cuenta con ese correo." };
    }
    if (
      existente.id === usuarioActual.id &&
      validos.rol !== usuarioActual.rol
    ) {
      return {
        ok: false,
        error: "No podés cambiar el rol de tu propia cuenta.",
      };
    }
    if (existente.id === usuarioActual.id && datos.activo === false) {
      return { ok: false, error: "No podés desactivar tu propia cuenta." };
    }

    const actualizado = {
      ...existente,
      ...validos,
      activo: datos.activo !== false,
      refugioId: validos.rol === ROLES.REFUGIO ? Number(datos.refugioId) : null,
      preferencias:
        validos.rol === ROLES.ADOPTANTE
          ? (existente.preferencias ?? {
              especie: "",
              tamano: "",
              rangoEdad: "",
              sexo: "",
              ciudad: validos.ciudad,
            })
          : null,
    };
    if (String(datos.password ?? "").trim())
      actualizado.password = datos.password;

    setUsuarios((actuales) =>
      actuales.map((u) => (u.id === existente.id ? actualizado : u)),
    );
    return { ok: true, usuario: actualizado };
  }

  function eliminarUsuario(id) {
    if (!puedeGestionarUsuarios()) {
      return {
        ok: false,
        error: "Solo la administración puede gestionar usuarios.",
      };
    }
    const usuarioId = Number(id);
    if (usuarioId === usuarioActual.id) {
      return { ok: false, error: "No podés eliminar tu propia cuenta." };
    }
    if (!usuarios.some((u) => u.id === usuarioId)) {
      return { ok: false, error: "No se encontró ese usuario." };
    }
    setUsuarios((actuales) => actuales.filter((u) => u.id !== usuarioId));
    return { ok: true };
  }

  // RN04: conserva los registros históricos y cambia solo el estado de cuenta.
  function cambiarEstadoUsuario(id, activo) {
    if (!puedeGestionarUsuarios()) {
      return {
        ok: false,
        error: "Solo la administración puede gestionar usuarios.",
      };
    }
    const usuarioId = Number(id);
    if (usuarioId === usuarioActual.id && !activo) {
      return { ok: false, error: "No podés desactivar tu propia cuenta." };
    }
    if (!usuarios.some((u) => u.id === usuarioId)) {
      return { ok: false, error: "No se encontró ese usuario." };
    }
    setUsuarios((actuales) =>
      actuales.map((u) =>
        u.id === usuarioId ? { ...u, activo: Boolean(activo) } : u,
      ),
    );
    return { ok: true };
  }

  function cambiarRolUsuario(id, rol, refugioId = null) {
    const usuario = usuarios.find((u) => u.id === Number(id));
    if (!usuario) return { ok: false, error: "No se encontró ese usuario." };
    return actualizarUsuario(usuario.id, {
      ...usuario,
      rol,
      refugioId,
      activo: usuario.activo,
    });
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
    buscarPorEmail,
    registrar,
    iniciarSesion,
    cerrarSesion,
    actualizarPerfil,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarEstadoUsuario,
    cambiarRolUsuario,
    cambiarUsuarioDemo,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto)
    throw new Error("useAuth tiene que usarse dentro de <AuthProvider>");
  return contexto;
}

// A dónde va cada rol después de iniciar sesión.
export function inicioSegunRol(rol) {
  if (rol === ROLES.ADMIN) return "/admin";
  if (rol === ROLES.REFUGIO) return "/refugio";
  return "/mi-cuenta";
}
