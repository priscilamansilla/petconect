// Reglas de negocio de la parte de refugio y solicitudes.
// Están acá, y no dentro de los contextos, para que el formulario, las
// pantallas y los contextos usen exactamente las mismas.

import { ESTADOS_MASCOTA, ESTADOS_SOLICITUD } from '../data/options';
import { numeroEntre, requerido, validarFormulario } from './validators';

const M = ESTADOS_MASCOTA;
const S = ESTADOS_SOLICITUD;

// RN08: a qué estados puede pasar una mascota desde cada estado.
// OJO: la sección 6 del documento no está escrita, así que esto es una
// propuesta. Para cambiar una regla alcanza con tocar esta tabla.
export const TRANSICIONES_MASCOTA = {
  [M.DISPONIBLE]: [M.EN_PROCESO, M.ADOPTADA, M.INACTIVA],
  [M.EN_PROCESO]: [M.DISPONIBLE, M.ADOPTADA, M.INACTIVA],
  [M.ADOPTADA]: [], // estado final
  [M.INACTIVA]: [M.DISPONIBLE],
};

// RN13 y RN14: lo mismo para las solicitudes. Solo se aprueba desde
// "En evaluación", y Aprobada, Rechazada y Cancelada son estados finales.
export const TRANSICIONES_SOLICITUD = {
  [S.PENDIENTE]: [S.EN_EVALUACION, S.CANCELADA],
  [S.EN_EVALUACION]: [S.APROBADA, S.RECHAZADA, S.CANCELADA],
  [S.APROBADA]: [],
  [S.RECHAZADA]: [],
  [S.CANCELADA]: [],
};

export function transicionValidaMascota(desde, hacia) {
  return (TRANSICIONES_MASCOTA[desde] ?? []).includes(hacia);
}

export function transicionValidaSolicitud(desde, hacia) {
  return (TRANSICIONES_SOLICITUD[desde] ?? []).includes(hacia);
}

// RN05 y RN23: campos obligatorios de una publicación. Devuelve un objeto
// con un mensaje por cada campo inválido (vacío si todo está bien).
export function validarMascota(datos) {
  return validarFormulario({
    nombre: [() => requerido(datos.nombre, 'El nombre')],
    especie: [() => requerido(datos.especie, 'La especie')],
    edad: [
      () => requerido(datos.edad, 'La edad'),
      () => numeroEntre(datos.edad, 0, 30, 'La edad'),
    ],
    sexo: [() => requerido(datos.sexo, 'El sexo')],
    tamano: [() => requerido(datos.tamano, 'El tamaño')],
    descripcion: [() => requerido(datos.descripcion, 'La descripción')],
    ciudad: [() => requerido(datos.ciudad, 'La ubicación')],
  });
}

// Fecha de hoy como 'AAAA-MM-DD', con el mismo formato que los datos de
// ejemplo. Se arma con la hora local: toISOString() usa UTC y a la noche
// devolvería el día siguiente.
export function hoy() {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}
