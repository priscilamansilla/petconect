import { createContext, useContext, useState } from 'react';
import { solicitudes as solicitudesIniciales } from '../data/applications';
import { ESTADOS_SOLICITUD } from '../data/options';

const ApplicationContext = createContext(null);

const ESTADOS_ACTIVOS = [
  ESTADOS_SOLICITUD.PENDIENTE,
  ESTADOS_SOLICITUD.EN_EVALUACION,
];

export function ApplicationProvider({ children }) {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);

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

  // --- Lo que falta implementar (bloque de solicitudes) ------------------

  // RN10 y RN11: crear la solicitud validando quién puede y si ya existe.
  function crearSolicitud(datos) {
    console.warn('TODO crearSolicitud()', datos);
  }

  // RN13 y RN14: cambiar el estado respetando las transiciones válidas y
  // dejando registro en el historial (RN22).
  function cambiarEstadoSolicitud(id, nuevoEstado, usuarioId, motivo) {
    console.warn(
      'TODO cambiarEstadoSolicitud()',
      id,
      nuevoEstado,
      usuarioId,
      motivo,
    );
  }

  // RN15 y RN16: al aprobar, la mascota pasa a "Adoptada" y las demás
  // solicitudes activas de esa mascota quedan canceladas.
  function aprobarSolicitud(id, usuarioId) {
    console.warn('TODO aprobarSolicitud()', id, usuarioId);
  }

  // -----------------------------------------------------------------------

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
