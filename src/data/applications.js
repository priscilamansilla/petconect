import { ESTADOS_SOLICITUD } from './options';

// Solicitudes de adopción de ejemplo.
// Cada solicitud guarda su estado actual y un historial de cambios con
// estado, fecha, usuario responsable y motivo (RN22).

export const solicitudes = [
  {
    id: 1,
    mascotaId: 3, // Nala
    adoptanteId: 5, // Sofía
    fecha: '2026-10-06',
    mensaje:
      'Vivo en un departamento con balcón cerrado y estoy casi todo el día en casa. Ya tuve gatos antes.',
    estado: ESTADOS_SOLICITUD.EN_EVALUACION,
    historial: [
      {
        estado: ESTADOS_SOLICITUD.PENDIENTE,
        fecha: '2026-10-06',
        usuarioId: 5,
        motivo: 'La adoptante envió la solicitud.',
      },
      {
        estado: ESTADOS_SOLICITUD.EN_EVALUACION,
        fecha: '2026-10-08',
        usuarioId: 2,
        motivo: 'El refugio tomó la solicitud para evaluarla.',
      },
    ],
  },
  {
    id: 2,
    mascotaId: 11, // Milo
    adoptanteId: 7, // Camila
    fecha: '2026-10-08',
    mensaje:
      'Tengo casa con patio y trabajo medio día. Busco un perro joven para que acompañe a mi otra perra.',
    estado: ESTADOS_SOLICITUD.EN_EVALUACION,
    historial: [
      {
        estado: ESTADOS_SOLICITUD.PENDIENTE,
        fecha: '2026-10-08',
        usuarioId: 7,
        motivo: 'La adoptante envió la solicitud.',
      },
      {
        estado: ESTADOS_SOLICITUD.EN_EVALUACION,
        fecha: '2026-10-10',
        usuarioId: 4,
        motivo: 'El refugio tomó la solicitud para evaluarla.',
      },
    ],
  },
  {
    id: 3,
    mascotaId: 9, // Benito
    adoptanteId: 6, // Martín
    fecha: '2026-10-12',
    mensaje: 'Vivo solo en un departamento y quiero un gato tranquilo.',
    estado: ESTADOS_SOLICITUD.PENDIENTE,
    historial: [
      {
        estado: ESTADOS_SOLICITUD.PENDIENTE,
        fecha: '2026-10-12',
        usuarioId: 6,
        motivo: 'El adoptante envió la solicitud.',
      },
    ],
  },
  {
    id: 4,
    mascotaId: 2, // Pupy
    adoptanteId: 5, // Sofía
    fecha: '2026-10-13',
    mensaje: 'Tengo patio grande y ya adopté un perro de este refugio en 2024.',
    estado: ESTADOS_SOLICITUD.PENDIENTE,
    historial: [
      {
        estado: ESTADOS_SOLICITUD.PENDIENTE,
        fecha: '2026-10-13',
        usuarioId: 5,
        motivo: 'La adoptante envió la solicitud.',
      },
    ],
  },
  {
    id: 5,
    mascotaId: 6, // Luna (ya adoptada)
    adoptanteId: 7, // Camila
    fecha: '2026-08-18',
    mensaje: 'Busco una perra chica para departamento.',
    estado: ESTADOS_SOLICITUD.APROBADA,
    historial: [
      {
        estado: ESTADOS_SOLICITUD.PENDIENTE,
        fecha: '2026-08-18',
        usuarioId: 7,
        motivo: 'La adoptante envió la solicitud.',
      },
      {
        estado: ESTADOS_SOLICITUD.EN_EVALUACION,
        fecha: '2026-08-20',
        usuarioId: 3,
        motivo: 'El refugio tomó la solicitud para evaluarla.',
      },
      {
        estado: ESTADOS_SOLICITUD.APROBADA,
        fecha: '2026-08-24',
        usuarioId: 3,
        motivo: 'Entrevista realizada. La adopción se confirmó.',
      },
    ],
  },
  {
    // Ejemplo de la RN16: al confirmarse la adopción de Luna, las demás
    // solicitudes activas para esa mascota quedaron canceladas.
    id: 6,
    mascotaId: 6, // Luna
    adoptanteId: 5, // Sofía
    fecha: '2026-08-19',
    mensaje: 'Me encantó Luna, vivo en un PH con patio chico.',
    estado: ESTADOS_SOLICITUD.CANCELADA,
    historial: [
      {
        estado: ESTADOS_SOLICITUD.PENDIENTE,
        fecha: '2026-08-19',
        usuarioId: 5,
        motivo: 'La adoptante envió la solicitud.',
      },
      {
        estado: ESTADOS_SOLICITUD.CANCELADA,
        fecha: '2026-08-24',
        usuarioId: 3,
        motivo: 'La mascota fue adoptada.',
      },
    ],
  },
  {
    id: 7,
    mascotaId: 1, // Max
    adoptanteId: 6, // Martín
    fecha: '2026-09-30',
    mensaje: 'Quiero un perro para que cuide la casa.',
    estado: ESTADOS_SOLICITUD.RECHAZADA,
    historial: [
      {
        estado: ESTADOS_SOLICITUD.PENDIENTE,
        fecha: '2026-09-30',
        usuarioId: 6,
        motivo: 'El adoptante envió la solicitud.',
      },
      {
        estado: ESTADOS_SOLICITUD.EN_EVALUACION,
        fecha: '2026-10-01',
        usuarioId: 2,
        motivo: 'El refugio tomó la solicitud para evaluarla.',
      },
      {
        estado: ESTADOS_SOLICITUD.RECHAZADA,
        fecha: '2026-10-03',
        usuarioId: 2,
        motivo:
          'No adoptamos para guardia. Se le ofrecieron otras mascotas del refugio.',
      },
    ],
  },
];

// Favoritos de ejemplo (RN18): pares de usuario y mascota, sin repetir.
export const favoritos = [
  { usuarioId: 5, mascotaId: 1 },
  { usuarioId: 5, mascotaId: 4 },
  { usuarioId: 6, mascotaId: 9 },
  { usuarioId: 7, mascotaId: 10 },
];
