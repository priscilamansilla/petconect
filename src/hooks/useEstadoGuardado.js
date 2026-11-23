import { useEffect, useState } from 'react';

// Incrementar al cambiar el esquema o los datos iniciales: se descarta el estado persistido de versiones anteriores
// v2: las fotos de las mascotas pasaron a rutas relativas ('pets/x.svg'),
// para que la carpeta dist funcione abierta desde la computadora.
export const VERSION_DATOS = 2;

const PREFIJO = 'petconect';

function clave(nombre) {
  return `${PREFIJO}:v${VERSION_DATOS}:${nombre}`;
}

// Elimina claves de versiones anteriores para evitar cargar datos incompatibles.
function limpiarVersionesViejas() {
  try {
    const actual = `${PREFIJO}:v${VERSION_DATOS}:`;
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(`${PREFIJO}:`) && !k.startsWith(actual))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // localStorage puede estar deshabilitado por el navegador.
  }
}

limpiarVersionesViejas();

function leer(nombre, valorInicial) {
  try {
    const guardado = window.localStorage.getItem(clave(nombre));
    return guardado === null ? valorInicial : JSON.parse(guardado);
  } catch {
    // Si no se puede leer o parsear el valor, se usan los datos iniciales.
    return valorInicial;
  }
}

// Persiste en localStorage el valor actual y lo inicializa desde allí cuando existe.
export function useEstadoGuardado(nombre, valorInicial) {
  const [valor, setValor] = useState(() => leer(nombre, valorInicial));

  useEffect(() => {
    try {
      window.localStorage.setItem(clave(nombre), JSON.stringify(valor));
    } catch {
      // La aplicación continúa en memoria si localStorage no está disponible.
    }
  }, [nombre, valor]);

  return [valor, setValor];
}

// Borra el estado persistido y recarga la aplicación con sus datos iniciales.
export function restablecerDatos() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(`${PREFIJO}:`))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Se intenta recargar aunque localStorage no permita borrar.
  }
  window.location.href = '/';
}
