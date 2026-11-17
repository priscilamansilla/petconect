// Listas de valores permitidos del sistema.
// Se usan en los filtros de búsqueda (RN17) y en los formularios de alta y
// edición de mascotas (RN05, RN23).

export const ESPECIES = ['Perro', 'Gato', 'Conejo'];

export const TAMANOS = ['Pequeño', 'Mediano', 'Grande'];

export const SEXOS = ['Macho', 'Hembra'];

export const CIUDADES = [
  'Moreno',
  'Morón',
  'Ramos Mejía',
  'Haedo',
  'Ituzaingó',
  'San Miguel',
  'CABA',
];

// Estados por los que puede pasar una mascota (RN08)
export const ESTADOS_MASCOTA = {
  DISPONIBLE: 'Disponible',
  EN_PROCESO: 'En proceso de adopción',
  ADOPTADA: 'Adoptada',
  INACTIVA: 'Inactiva',
};

// Estados por los que puede pasar una solicitud (RN13)
export const ESTADOS_SOLICITUD = {
  PENDIENTE: 'Pendiente',
  EN_EVALUACION: 'En evaluación',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
  CANCELADA: 'Cancelada',
};

// Rangos de edad usados por el filtro de búsqueda (RN17)
export const RANGOS_EDAD = [
  { id: 'cachorro', etiqueta: 'Cachorro (hasta 1 año)', min: 0, max: 1 },
  { id: 'joven', etiqueta: 'Joven (1 a 3 años)', min: 1, max: 3 },
  { id: 'adulto', etiqueta: 'Adulto (3 a 8 años)', min: 3, max: 8 },
  { id: 'senior', etiqueta: 'Senior (más de 8 años)', min: 8, max: 99 },
];

// Roles del sistema (RN02)
export const ROLES = {
  ADOPTANTE: 'adoptante',
  REFUGIO: 'refugio',
  ADMIN: 'administrador',
};

// Color de la etiqueta con la que se muestra cada estado en pantalla.
export const COLOR_ESTADO_MASCOTA = {
  [ESTADOS_MASCOTA.DISPONIBLE]: 'success',
  [ESTADOS_MASCOTA.EN_PROCESO]: 'warning',
  [ESTADOS_MASCOTA.ADOPTADA]: 'secondary',
  [ESTADOS_MASCOTA.INACTIVA]: 'dark',
};

export const COLOR_ESTADO_SOLICITUD = {
  [ESTADOS_SOLICITUD.PENDIENTE]: 'warning',
  [ESTADOS_SOLICITUD.EN_EVALUACION]: 'info',
  [ESTADOS_SOLICITUD.APROBADA]: 'success',
  [ESTADOS_SOLICITUD.RECHAZADA]: 'danger',
  [ESTADOS_SOLICITUD.CANCELADA]: 'secondary',
};
