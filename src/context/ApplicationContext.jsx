import { createContext, useContext } from 'react';
import { solicitudes as solicitudesIniciales } from '../data/applications';
import { ESTADOS_MASCOTA, ESTADOS_SOLICITUD, ROLES } from '../data/options';
import { useEstadoGuardado } from '../hooks/useEstadoGuardado';
import {
  hoy,
  transicionValidaMascota,
  transicionValidaSolicitud,
} from '../utils/reglas';
import { requerido } from '../utils/validators';
import { useAuth } from './AuthContext';
import { usePets } from './PetContext';

const ApplicationContext = createContext(null);

const ESTADOS_ACTIVOS = [
  ESTADOS_SOLICITUD.PENDIENTE,
  ESTADOS_SOLICITUD.EN_EVALUACION,
];

// Motivo que queda en el historial cuando quien hace el cambio no escribe uno.
// El rechazo es la excepción: ahí el motivo es obligatorio.
const MOTIVO_POR_DEFECTO = {
  [ESTADOS_SOLICITUD.EN_EVALUACION]: 'El refugio tomó la solicitud para evaluarla.',
  [ESTADOS_SOLICITUD.CANCELADA]: 'La solicitud fue cancelada.',
};

// RN22: cada paso del historial guarda estado, fecha, usuario y motivo.
function paso(estado, usuarioId, motivo) {
  return { estado, fecha: hoy(), usuarioId, motivo };
}

// RN12: el refugio solo trabaja con las solicitudes de sus propias mascotas.
// La administración también puede.
function puedeResponder(usuario, mascota) {
  if (usuario.rol === ROLES.ADMIN) return true;
  return (
    usuario.rol === ROLES.REFUGIO &&
    Boolean(mascota) &&
    usuario.refugioId === mascota.refugioId
  );
}

export function ApplicationProvider({ children }) {
  const { usuarios } = useAuth();
  const { obtenerMascota, cambiarEstado: cambiarEstadoMascota } = usePets();
  const [solicitudes, setSolicitudes] = useEstadoGuardado(
    'solicitudes',
    solicitudesIniciales,
  );

  function buscarUsuario(id) {
    return usuarios.find((u) => u.id === Number(id)) ?? null;
  }

  function solicitudesDeAdoptante(adoptanteId) {
    return solicitudes.filter((s) => s.adoptanteId === Number(adoptanteId));
  }

  function solicitudesDeMascota(mascotaId) {
    return solicitudes.filter((s) => s.mascotaId === Number(mascotaId));
  }

  // RN11: no puede haber más de una solicitud activa del mismo adoptante
  // para la misma mascota.
  function tieneSolicitudActiva(adoptanteId, mascotaId) {
    return solicitudes.some(
      (s) =>
        s.adoptanteId === Number(adoptanteId) &&
        s.mascotaId === Number(mascotaId) &&
        ESTADOS_ACTIVOS.includes(s.estado),
    );
  }

  // Todas las funciones de abajo devuelven { ok: true } o
  // { ok: false, error: 'mensaje para mostrar' }.

  // RN07, RN10 y RN11: crear la solicitud validando quién puede y si ya existe.
  // datos = { mascotaId, adoptanteId, mensaje }
  function crearSolicitud(datos) {
    const adoptante = buscarUsuario(datos.adoptanteId);
    if (
      !adoptante ||
      adoptante.rol !== ROLES.ADOPTANTE ||
      !adoptante.activo
    ) {
      return {
        ok: false,
        error:
          'Solo los adoptantes con una cuenta activa pueden solicitar una adopción.',
      };
    }

    const mascota = obtenerMascota(datos.mascotaId);
    if (!mascota) return { ok: false, error: 'No encontramos esa mascota.' };

    // RN07: solo las mascotas disponibles reciben solicitudes nuevas.
    if (mascota.estado !== ESTADOS_MASCOTA.DISPONIBLE) {
      return {
        ok: false,
        error: `${mascota.nombre} no está recibiendo solicitudes (estado: ${mascota.estado}).`,
      };
    }

    if (tieneSolicitudActiva(adoptante.id, mascota.id)) {
      return {
        ok: false,
        error: `Ya tenés una solicitud activa para ${mascota.nombre}.`,
      };
    }

    // RN23: el mensaje es obligatorio, el refugio lo usa para evaluar.
    const texto = String(datos.mensaje ?? '').trim();
    const errorMensaje = requerido(texto, 'El mensaje');
    if (errorMensaje) return { ok: false, error: errorMensaje };

    const fecha = hoy();
    const nueva = {
      id: Math.max(0, ...solicitudes.map((s) => s.id)) + 1,
      mascotaId: mascota.id,
      adoptanteId: adoptante.id,
      fecha,
      mensaje: texto,
      estado: ESTADOS_SOLICITUD.PENDIENTE,
      historial: [
        paso(ESTADOS_SOLICITUD.PENDIENTE, adoptante.id, 'Se envió la solicitud.'),
      ],
    };

    setSolicitudes((actuales) => [...actuales, nueva]);
    return { ok: true, solicitud: nueva };
  }

  // RN13 y RN14: cambiar el estado respetando las transiciones válidas y
  // dejando registro en el historial (RN22).
  //   - El refugio de la mascota (o la administración) pasa la solicitud a
  //     evaluación, la rechaza o la cancela.
  //   - El adoptante solo puede cancelar su propia solicitud.
  //   - Para aprobar se usa aprobarSolicitud(), porque tiene más efectos.
  function cambiarEstadoSolicitud(id, nuevoEstado, usuarioId, motivo) {
    const solicitud = solicitudes.find((s) => s.id === Number(id));
    if (!solicitud) return { ok: false, error: 'No encontramos esa solicitud.' };

    const usuario = buscarUsuario(usuarioId);
    if (!usuario) {
      return { ok: false, error: 'No se pudo identificar a quien hace el cambio.' };
    }

    if (nuevoEstado === ESTADOS_SOLICITUD.APROBADA) {
      return aprobarSolicitud(id, usuarioId);
    }

    const mascota = obtenerMascota(solicitud.mascotaId);
    const esLaPropia =
      usuario.rol === ROLES.ADOPTANTE && usuario.id === solicitud.adoptanteId;

    if (esLaPropia) {
      if (nuevoEstado !== ESTADOS_SOLICITUD.CANCELADA) {
        return { ok: false, error: 'Tu solicitud solo se puede cancelar.' };
      }
    } else if (!puedeResponder(usuario, mascota)) {
      return {
        ok: false,
        error: 'Solo el refugio de la mascota puede cambiar esta solicitud.',
      };
    }

    if (!transicionValidaSolicitud(solicitud.estado, nuevoEstado)) {
      return {
        ok: false,
        error: `Una solicitud «${solicitud.estado}» no puede pasar a «${nuevoEstado}».`,
      };
    }

    const razon = String(motivo ?? '').trim();
    if (nuevoEstado === ESTADOS_SOLICITUD.RECHAZADA && !razon) {
      return { ok: false, error: 'Escribí el motivo del rechazo.' };
    }

    setSolicitudes((actuales) =>
      actuales.map((s) =>
        s.id === solicitud.id
          ? {
              ...s,
              estado: nuevoEstado,
              historial: [
                ...s.historial,
                paso(
                  nuevoEstado,
                  usuario.id,
                  razon || MOTIVO_POR_DEFECTO[nuevoEstado],
                ),
              ],
            }
          : s,
      ),
    );

    // La mascota acompaña a sus solicitudes (así están los datos de ejemplo):
    // pasa a "En proceso" cuando una solicitud entra en evaluación y vuelve a
    // "Disponible" cuando se corta la última que estaba en evaluación.
    if (mascota) {
      if (
        nuevoEstado === ESTADOS_SOLICITUD.EN_EVALUACION &&
        mascota.estado === ESTADOS_MASCOTA.DISPONIBLE
      ) {
        cambiarEstadoMascota(mascota.id, ESTADOS_MASCOTA.EN_PROCESO, {
          automatico: true,
        });
      }

      const seCortaEvaluacion =
        solicitud.estado === ESTADOS_SOLICITUD.EN_EVALUACION &&
        (nuevoEstado === ESTADOS_SOLICITUD.RECHAZADA ||
          nuevoEstado === ESTADOS_SOLICITUD.CANCELADA);
      const sigueEvaluandose = solicitudes.some(
        (s) =>
          s.id !== solicitud.id &&
          s.mascotaId === mascota.id &&
          s.estado === ESTADOS_SOLICITUD.EN_EVALUACION,
      );
      if (
        seCortaEvaluacion &&
        !sigueEvaluandose &&
        mascota.estado === ESTADOS_MASCOTA.EN_PROCESO
      ) {
        cambiarEstadoMascota(mascota.id, ESTADOS_MASCOTA.DISPONIBLE, {
          automatico: true,
        });
      }
    }

    return { ok: true };
  }

  // RN14, RN15 y RN16: solo se aprueba desde "En evaluación". Al aprobar, la
  // mascota pasa a "Adoptada" y las demás solicitudes activas de esa mascota
  // quedan canceladas, cada una con su paso en el historial.
  function aprobarSolicitud(id, usuarioId) {
    const solicitud = solicitudes.find((s) => s.id === Number(id));
    if (!solicitud) return { ok: false, error: 'No encontramos esa solicitud.' };

    const usuario = buscarUsuario(usuarioId);
    if (!usuario) {
      return { ok: false, error: 'No se pudo identificar a quien hace el cambio.' };
    }

    const mascota = obtenerMascota(solicitud.mascotaId);
    if (!mascota) return { ok: false, error: 'No encontramos esa mascota.' };

    if (!puedeResponder(usuario, mascota)) {
      return {
        ok: false,
        error: 'Solo el refugio de la mascota puede aprobar esta solicitud.',
      };
    }

    if (!transicionValidaSolicitud(solicitud.estado, ESTADOS_SOLICITUD.APROBADA)) {
      return {
        ok: false,
        error: 'Solo se puede aprobar una solicitud que está en evaluación.',
      };
    }

    // Se controla antes de tocar nada, para no dejar la solicitud aprobada con
    // una mascota que no puede pasar a "Adoptada".
    if (!transicionValidaMascota(mascota.estado, ESTADOS_MASCOTA.ADOPTADA)) {
      return {
        ok: false,
        error: `${mascota.nombre} está «${mascota.estado}» y no se puede marcar como adoptada.`,
      };
    }

    setSolicitudes((actuales) =>
      actuales.map((s) => {
        if (s.id === solicitud.id) {
          return {
            ...s,
            estado: ESTADOS_SOLICITUD.APROBADA,
            historial: [
              ...s.historial,
              paso(
                ESTADOS_SOLICITUD.APROBADA,
                usuario.id,
                'El refugio aprobó la solicitud. La adopción se confirmó.',
              ),
            ],
          };
        }
        if (
          s.mascotaId === solicitud.mascotaId &&
          ESTADOS_ACTIVOS.includes(s.estado)
        ) {
          return {
            ...s,
            estado: ESTADOS_SOLICITUD.CANCELADA,
            historial: [
              ...s.historial,
              paso(
                ESTADOS_SOLICITUD.CANCELADA,
                usuario.id,
                'La mascota fue adoptada.',
              ),
            ],
          };
        }
        return s;
      }),
    );

    cambiarEstadoMascota(mascota.id, ESTADOS_MASCOTA.ADOPTADA, {
      automatico: true,
    });

    return { ok: true };
  }

  const valor = {
    solicitudes,
    setSolicitudes,
    solicitudesDeAdoptante,
    solicitudesDeMascota,
    tieneSolicitudActiva,
    crearSolicitud,
    cambiarEstadoSolicitud,
    aprobarSolicitud,
  };

  return (
    <ApplicationContext.Provider value={valor}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const contexto = useContext(ApplicationContext);
  if (!contexto)
    throw new Error(
      'useApplications tiene que usarse dentro de <ApplicationProvider>',
    );
  return contexto;
}
