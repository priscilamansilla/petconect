import { createContext, useContext } from 'react';
import { mascotas as mascotasIniciales } from '../data/pets';
import { refugios as refugiosIniciales } from '../data/shelters';
import {
  CIUDADES,
  ESPECIES,
  ESTADOS_MASCOTA,
  RANGOS_EDAD,
  ROLES,
  SEXOS,
  TAMANOS,
} from '../data/options';
import { useEstadoGuardado } from '../hooks/useEstadoGuardado';
import {
  hoy,
  transicionValidaMascota,
  validarMascota,
} from '../utils/reglas';
import { useAuth } from './AuthContext';

const PetContext = createContext(null);

// Las mascotas nuevas todavía no tienen foto propia, así que se les pone una
// ilustración según la especie.
const FOTO_POR_ESPECIE = {
  Perro: '/pets/max.svg',
  Gato: '/pets/nala.svg',
  Conejo: '/pets/pelusa.svg',
};

const ESTADOS_MASCOTA_VALIDOS = Object.values(ESTADOS_MASCOTA);

const ERROR_RN06 =
  'Solo el refugio responsable puede modificar esta publicación.';

// Deja los datos del formulario listos para guardar: sin espacios sobrantes
// y con la edad como número (edadEnTexto compara con === 0).
function normalizar(datos) {
  return {
    nombre: datos.nombre.trim(),
    ...(datos.raza !== undefined ? { raza: String(datos.raza).trim() } : {}),
    especie: datos.especie,
    edad: Number(datos.edad),
    sexo: datos.sexo,
    tamano: datos.tamano,
    descripcion: datos.descripcion.trim(),
    ciudad: datos.ciudad,
    vacunado: Boolean(datos.vacunado),
    castrado: Boolean(datos.castrado),
    aptoNinos: Boolean(datos.aptoNinos),
    aptoDepartamento: Boolean(datos.aptoDepartamento),
  };
}

// RN05, RN08 y RN23: valida campos, valores permitidos y estado de la mascota para el alta y edición administrativa.
function validarDatosAdminMascota(datos) {
  const errores = validarMascota(datos);
  if (!ESPECIES.includes(datos.especie)) errores.especie = 'Seleccioná una especie válida.';
  if (!SEXOS.includes(datos.sexo)) errores.sexo = 'Seleccioná un sexo válido.';
  if (!TAMANOS.includes(datos.tamano)) errores.tamano = 'Seleccioná un tamaño válido.';
  if (!CIUDADES.includes(datos.ciudad)) errores.ciudad = 'Seleccioná una ubicación válida.';
  if (!String(datos.raza ?? '').trim()) errores.raza = 'La raza es obligatoria.';
  if (!Number.isInteger(Number(datos.edad))) errores.edad = 'La edad debe ser un número entero.';
  if (!ESTADOS_MASCOTA_VALIDOS.includes(datos.estado)) errores.estado = 'Seleccioná un estado válido.';
  return errores;
}

// RN21 y RN23: valida los datos obligatorios y el formato de correo del refugio.
function validarDatosRefugio(datos) {
  const nombre = String(datos.nombre ?? '').trim();
  const responsable = String(datos.responsable ?? '').trim();
  const email = String(datos.email ?? '').trim().toLowerCase();
  const telefono = String(datos.telefono ?? '').trim();
  const ciudad = String(datos.ciudad ?? '').trim();
  const descripcion = String(datos.descripcion ?? '').trim();

  if (!nombre || !responsable || !email || !telefono || !ciudad || !descripcion) {
    return { error: 'Completá nombre, responsable, correo, teléfono, ubicación y descripción.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { error: 'Escribí un correo electrónico válido.' };
  }
  if (!CIUDADES.includes(ciudad)) {
    return { error: 'Seleccioná una ubicación válida.' };
  }
  return { nombre, responsable, email, telefono, ciudad, descripcion };
}

export function PetProvider({ children }) {
  const { usuarioActual } = useAuth();
  const [mascotas, setMascotas] = useEstadoGuardado(
    'mascotas',
    mascotasIniciales,
  );
  const [refugios, setRefugios] = useEstadoGuardado(
    'refugios',
    refugiosIniciales,
  );

  function obtenerMascota(id) {
    return mascotas.find((m) => m.id === Number(id)) ?? null;
  }

  function obtenerRefugio(id) {
    return refugios.find((r) => r.id === Number(id)) ?? null;
  }

  function mascotasDeRefugio(refugioId) {
    return mascotas.filter((m) => m.refugioId === Number(refugioId));
  }

  // RN17: los filtros seleccionados se aplican todos juntos.
  function filtrar(filtros) {
    return mascotas.filter((mascota) => {
      if (filtros.especie && mascota.especie !== filtros.especie) return false;
      if (filtros.tamano && mascota.tamano !== filtros.tamano) return false;
      if (filtros.sexo && mascota.sexo !== filtros.sexo) return false;
      if (filtros.ciudad && mascota.ciudad !== filtros.ciudad) return false;
      if (filtros.estado && mascota.estado !== filtros.estado) return false;

      if (filtros.rangoEdad) {
        const rango = RANGOS_EDAD.find((r) => r.id === filtros.rangoEdad);
        if (rango && (mascota.edad < rango.min || mascota.edad >= rango.max))
          return false;
      }

      if (filtros.texto) {
        const texto = filtros.texto.toLowerCase();
        const coincide =
          mascota.nombre.toLowerCase().includes(texto) ||
          mascota.descripcion.toLowerCase().includes(texto);
        if (!coincide) return false;
      }

      return true;
    });
  }

  // RN06: un refugio solo puede modificar las mascotas que administra.
  // La administración también puede (la pantalla de admin tiene un botón
  // "Desactivar" sobre cualquier mascota).
  function puedeAdministrar(mascota) {
    if (!usuarioActual) return false;
    if (usuarioActual.rol === ROLES.ADMIN) return true;
    return (
      usuarioActual.rol === ROLES.REFUGIO &&
      usuarioActual.refugioId === mascota.refugioId
    );
  }

  // RN02, RN03 y RN21: limita la gestión administrativa de mascotas y refugios al rol administrador.
  function puedeAdministrarCatalogos() {
    return usuarioActual?.rol === ROLES.ADMIN;
  }

  // Todas las funciones de abajo devuelven { ok: true } o
  // { ok: false, error: 'mensaje para mostrar' }, igual que registrar() e
  // iniciarSesion() en AuthContext.

  // RN05: alta de una publicación con todos los campos obligatorios.
  // La mascota queda asociada al refugio de quien la publica y siempre arranca
  // como "Disponible".
  function publicarMascota(datos) {
    if (usuarioActual?.rol !== ROLES.REFUGIO || usuarioActual.refugioId == null) {
      return { ok: false, error: 'Solo un refugio puede publicar mascotas.' };
    }

    const errores = validarMascota(datos);
    if (Object.keys(errores).length > 0) {
      return { ok: false, error: 'Revisá los datos del formulario.', errores };
    }

    const nueva = {
      id: Math.max(0, ...mascotas.map((m) => m.id)) + 1,
      ...normalizar(datos),
      estado: ESTADOS_MASCOTA.DISPONIBLE,
      refugioId: usuarioActual.refugioId,
      foto: FOTO_POR_ESPECIE[datos.especie] ?? '/favicon.svg',
      fechaPublicacion: hoy(),
    };

    setMascotas((actuales) => [...actuales, nueva]);
    return { ok: true, mascota: nueva };
  }

  // RN05, RN06, RN21 y RN23: registra la mascota con datos válidos y un refugio existente.
  function publicarMascotaAdmin(datos) {
    if (!puedeAdministrarCatalogos()) {
      return { ok: false, error: 'Solo la administración puede registrar mascotas desde este panel.' };
    }
    const errores = validarDatosAdminMascota(datos);
    const refugioId = Number(datos.refugioId);
    const refugio = refugios.find((r) => r.id === refugioId);
    if (!refugio || !refugio.activo) {
      errores.refugioId = 'Seleccioná un refugio activo existente.';
    }
    if (Object.keys(errores).length > 0) {
      return { ok: false, error: 'Revisá los datos de la mascota.', errores };
    }

    const nueva = {
      id: Math.max(0, ...mascotas.map((m) => m.id)) + 1,
      ...normalizar(datos),
      edad: Number(datos.edad),
      estado: datos.estado,
      refugioId,
      foto: FOTO_POR_ESPECIE[datos.especie] ?? '/favicon.svg',
      fechaPublicacion: hoy(),
    };
    setMascotas((actuales) => [...actuales, nueva]);
    return { ok: true, mascota: nueva };
  }

  // RN06, RN08, RN21, RN23 y RN24: actualiza la publicación sin romper su refugio ni sus transiciones de estado.
  function editarMascotaAdmin(id, datos) {
    if (!puedeAdministrarCatalogos()) {
      return { ok: false, error: 'Solo la administración puede editar mascotas desde este panel.' };
    }
    const actual = obtenerMascota(id);
    if (!actual) return { ok: false, error: 'No encontramos esa mascota.' };
    const errores = validarDatosAdminMascota(datos);
    const refugioId = Number(datos.refugioId);
    const refugio = refugios.find((r) => r.id === refugioId);
    if (!refugio || (!refugio.activo && actual.refugioId !== refugioId)) {
      errores.refugioId = 'Seleccioná un refugio activo existente.';
    }
    if (Object.keys(errores).length > 0) {
      return { ok: false, error: 'Revisá los datos de la mascota.', errores };
    }
    if (
      datos.estado !== actual.estado &&
      !transicionValidaMascota(actual.estado, datos.estado)
    ) {
      return {
        ok: false,
        error: `Una mascota «${actual.estado}» no puede pasar a «${datos.estado}».`,
      };
    }

    setMascotas((actuales) =>
      actuales.map((m) =>
        m.id === actual.id
          ? {
              ...m,
              ...normalizar(datos),
              edad: Number(datos.edad),
              estado: datos.estado,
              refugioId,
              foto: FOTO_POR_ESPECIE[datos.especie] ?? m.foto,
            }
          : m,
      ),
    );
    return { ok: true };
  }

  // RN21 y RN23: crea refugios con correo único y datos validados.
  function crearRefugioAdmin(datos) {
    if (!puedeAdministrarCatalogos()) {
      return { ok: false, error: 'Solo la administración puede gestionar refugios.' };
    }
    const valido = validarDatosRefugio(datos);
    if (valido.error) return { ok: false, error: valido.error };
    if (refugios.some((r) => r.email.trim().toLowerCase() === valido.email)) {
      return { ok: false, error: 'Ya existe un refugio con ese correo.' };
    }
    const nuevo = {
      id: Math.max(0, ...refugios.map((r) => r.id)) + 1,
      ...valido,
      activo: datos.activo !== false,
    };
    setRefugios((actuales) => [...actuales, nuevo]);
    return { ok: true, refugio: nuevo };
  }

  // RN21 y RN23: modifica la información conservando el estado actual y evitando correos duplicados.
  function actualizarRefugioAdmin(id, datos) {
    if (!puedeAdministrarCatalogos()) {
      return { ok: false, error: 'Solo la administración puede gestionar refugios.' };
    }
    const existente = refugios.find((r) => r.id === Number(id));
    if (!existente) return { ok: false, error: 'No encontramos ese refugio.' };
    const valido = validarDatosRefugio(datos);
    if (valido.error) return { ok: false, error: valido.error };
    if (refugios.some((r) => r.id !== existente.id && r.email.trim().toLowerCase() === valido.email)) {
      return { ok: false, error: 'Ya existe un refugio con ese correo.' };
    }
    const actualizado = {
      ...existente,
      ...valido,
      activo: datos.activo === undefined ? existente.activo : Boolean(datos.activo),
    };
    setRefugios((actuales) =>
      actuales.map((r) => (r.id === existente.id ? actualizado : r)),
    );
    return { ok: true, refugio: actualizado };
  }

  // RN21 y RN24: actualiza el estado administrativo del refugio conservando sus registros asociados.
  function cambiarEstadoRefugioAdmin(id, activo) {
    if (!puedeAdministrarCatalogos()) {
      return { ok: false, error: 'Solo la administración puede gestionar refugios.' };
    }
    const refugioId = Number(id);
    if (!refugios.some((r) => r.id === refugioId)) {
      return { ok: false, error: 'No encontramos ese refugio.' };
    }
    setRefugios((actuales) =>
      actuales.map((r) => (r.id === refugioId ? { ...r, activo: Boolean(activo) } : r)),
    );
    return { ok: true };
  }

  // RN06 y RN08: edita los datos de una publicación. Si el estado cambia, tiene
  // que ser una transición válida. El refugio y la fecha de publicación no se
  // tocan nunca.
  function editarMascota(id, datos) {
    const actual = obtenerMascota(id);
    if (!actual) return { ok: false, error: 'No encontramos esa mascota.' };
    if (!puedeAdministrar(actual)) return { ok: false, error: ERROR_RN06 };

    const errores = validarMascota(datos);
    if (Object.keys(errores).length > 0) {
      return { ok: false, error: 'Revisá los datos del formulario.', errores };
    }

    const cambiaEstado =
      datos.estado !== undefined && datos.estado !== actual.estado;
    if (cambiaEstado && !transicionValidaMascota(actual.estado, datos.estado)) {
      return {
        ok: false,
        error: `Una mascota «${actual.estado}» no puede pasar a «${datos.estado}».`,
      };
    }

    const cambios = {
      ...normalizar(datos),
      estado: cambiaEstado ? datos.estado : actual.estado,
    };

    setMascotas((actuales) =>
      actuales.map((m) => (m.id === actual.id ? { ...m, ...cambios } : m)),
    );
    return { ok: true };
  }

  // RN08: los cambios de estado tienen que respetar las transiciones válidas.
  // Con { automatico: true } no se controla quién lo pide: lo usa el contexto
  // de solicitudes cuando el cambio es consecuencia de una solicitud (por
  // ejemplo, una adopción aprobada por el refugio o una solicitud cancelada
  // por el adoptante).
  function cambiarEstado(id, nuevoEstado, { automatico = false } = {}) {
    const mascota = obtenerMascota(id);
    if (!mascota) return { ok: false, error: 'No encontramos esa mascota.' };
    if (!automatico && !puedeAdministrar(mascota)) {
      return { ok: false, error: ERROR_RN06 };
    }
    if (!transicionValidaMascota(mascota.estado, nuevoEstado)) {
      return {
        ok: false,
        error: `Una mascota «${mascota.estado}» no puede pasar a «${nuevoEstado}».`,
      };
    }

    setMascotas((actuales) =>
      actuales.map((m) =>
        m.id === mascota.id ? { ...m, estado: nuevoEstado } : m,
      ),
    );
    return { ok: true };
  }

  // RN09: una mascota con solicitudes no se elimina, se desactiva.
  // Este contexto no puede ver las solicitudes (el de solicitudes está adentro
  // de este), así que quien llama avisa si las tiene.
  function eliminarMascota(id, tieneSolicitudes = false) {
    const mascota = obtenerMascota(id);
    if (!mascota) return { ok: false, error: 'No encontramos esa mascota.' };
    if (!puedeAdministrar(mascota)) return { ok: false, error: ERROR_RN06 };

    if (tieneSolicitudes) {
      const resultado = cambiarEstado(mascota.id, ESTADOS_MASCOTA.INACTIVA);
      return resultado.ok ? { ok: true, desactivada: true } : resultado;
    }

    setMascotas((actuales) => actuales.filter((m) => m.id !== mascota.id));
    return { ok: true, desactivada: false };
  }

  const valor = {
    mascotas,
    setMascotas,
    refugios,
    disponibles: mascotas.filter(
      (m) => m.estado === ESTADOS_MASCOTA.DISPONIBLE,
    ),
    obtenerMascota,
    obtenerRefugio,
    mascotasDeRefugio,
    filtrar,
    publicarMascota,
    publicarMascotaAdmin,
    editarMascota,
    editarMascotaAdmin,
    cambiarEstado,
    eliminarMascota,
    crearRefugioAdmin,
    actualizarRefugioAdmin,
    cambiarEstadoRefugioAdmin,
  };

  return <PetContext.Provider value={valor}>{children}</PetContext.Provider>;
}

export function usePets() {
  const contexto = useContext(PetContext);
  if (!contexto)
    throw new Error('usePets tiene que usarse dentro de <PetProvider>');
  return contexto;
}
