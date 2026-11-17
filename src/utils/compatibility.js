import { RANGOS_EDAD, TAMANOS } from '../data/options';

// Cálculo del puntaje de compatibilidad entre un adoptante y una mascota
// (RN19 y RN20). El resultado va de 0 a 100 y es orientativo: no aprueba
// ni rechaza automáticamente una adopción.
//
// OJO: los pesos de abajo son una propuesta nuestra. El PDF los remite a
// una "sección 7" que todavía no está escrita, así que si el grupo decide
// otros valores hay que cambiarlos acá y en el documento.

export const PESOS = {
  especie: 30,
  tamano: 25,
  edad: 20,
  ciudad: 15,
  sexo: 10,
};

// Devuelve el id del rango de edad al que pertenece una mascota.
function rangoDeEdad(edad) {
  const rango = RANGOS_EDAD.find((r) => edad >= r.min && edad < r.max);
  return rango ? rango.id : null;
}

// Nombre del rango para mostrar en pantalla, a partir de su id.
function etiquetaRango(id) {
  return RANGOS_EDAD.find((r) => r.id === id)?.etiqueta ?? null;
}

// Dos tamaños contiguos (por ejemplo pequeño y mediano) se parecen más que
// dos extremos, así que suman la mitad del peso en vez de cero.
function puntajePorCercania(lista, preferido, valor, peso) {
  if (!preferido) return peso; // sin preferencia cargada, no se penaliza
  if (preferido === valor) return peso;
  const distancia = Math.abs(lista.indexOf(preferido) - lista.indexOf(valor));
  return distancia === 1 ? peso * 0.5 : 0;
}

export function calcularCompatibilidad(preferencias, mascota) {
  // Un usuario sin preferencias cargadas no tiene puntaje calculable.
  if (!preferencias || !mascota) return null;

  const ordenRangos = RANGOS_EDAD.map((r) => r.id);

  const detalle = [
    {
      criterio: 'Especie',
      peso: PESOS.especie,
      esperado: preferencias.especie,
      obtenido: mascota.especie,
      puntos: !preferencias.especie
        ? PESOS.especie
        : preferencias.especie === mascota.especie
          ? PESOS.especie
          : 0,
    },
    {
      criterio: 'Tamaño',
      peso: PESOS.tamano,
      esperado: preferencias.tamano,
      obtenido: mascota.tamano,
      puntos: puntajePorCercania(
        TAMANOS,
        preferencias.tamano,
        mascota.tamano,
        PESOS.tamano,
      ),
    },
    {
      criterio: 'Edad',
      peso: PESOS.edad,
      esperado: etiquetaRango(preferencias.rangoEdad),
      obtenido: etiquetaRango(rangoDeEdad(mascota.edad)),
      puntos: puntajePorCercania(
        ordenRangos,
        preferencias.rangoEdad,
        rangoDeEdad(mascota.edad),
        PESOS.edad,
      ),
    },
    {
      criterio: 'Ubicación',
      peso: PESOS.ciudad,
      esperado: preferencias.ciudad,
      obtenido: mascota.ciudad,
      puntos: !preferencias.ciudad
        ? PESOS.ciudad
        : preferencias.ciudad === mascota.ciudad
          ? PESOS.ciudad
          : 0,
    },
    {
      criterio: 'Sexo',
      peso: PESOS.sexo,
      esperado: preferencias.sexo,
      obtenido: mascota.sexo,
      puntos: !preferencias.sexo
        ? PESOS.sexo
        : preferencias.sexo === mascota.sexo
          ? PESOS.sexo
          : 0,
    },
  ];

  const puntaje = Math.round(
    detalle.reduce((total, item) => total + item.puntos, 0),
  );

  return { puntaje, detalle };
}

// Etiqueta y color con los que se muestra el puntaje en pantalla.
export function leerPuntaje(puntaje) {
  if (puntaje >= 80) return { texto: 'Muy compatible', color: 'success' };
  if (puntaje >= 55) return { texto: 'Compatible', color: 'primary' };
  if (puntaje >= 30) return { texto: 'Poco compatible', color: 'warning' };
  return { texto: 'Perfil distinto', color: 'secondary' };
}
