import { useEffect, useState } from 'react';

// Guarda el estado en el navegador (localStorage) para que lo que hace el
// usuario sobreviva a recargar la página.
//
// Se usa igual que useState:
//   const [mascotas, setMascotas] = useEstadoGuardado('mascotas', mascotasIniciales);
//
// La primera vez que se abre la app no hay nada guardado, así que arranca
// con los datos de ejemplo de src/data/. A partir de ahí, cada cambio se
// guarda solo.

// OJO, LEER ESTO:
// Si cambiás algo en src/data/ (agregás una mascota, renombrás un campo),
// subí este número. Eso descarta lo que haya guardado en el navegador y
// vuelve a cargar los datos nuevos. Si no lo subís, vos vas a ver los datos
// viejos y vas a pensar que tu cambio no funcionó.
export const VERSION_DATOS = 1;

const PREFIJO = 'petconect';

function clave(nombre) {
  return `${PREFIJO}:v${VERSION_DATOS}:${nombre}`;
}

// Borra lo guardado por versiones anteriores, para no dejar basura.
function limpiarVersionesViejas() {
  try {
    const actual = `${PREFIJO}:v${VERSION_DATOS}:`;
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(`${PREFIJO}:`) && !k.startsWith(actual))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Si el navegador no deja usar localStorage, no pasa nada.
  }
}

limpiarVersionesViejas();

function leer(nombre, valorInicial) {
  try {
    const guardado = window.localStorage.getItem(clave(nombre));
    return guardado === null ? valorInicial : JSON.parse(guardado);
  } catch {
    // Puede fallar en modo incógnito o si el JSON quedó corrupto.
    return valorInicial;
  }
}

export function useEstadoGuardado(nombre, valorInicial) {
  const [valor, setValor] = useState(() => leer(nombre, valorInicial));

  useEffect(() => {
    try {
      window.localStorage.setItem(clave(nombre), JSON.stringify(valor));
    } catch {
      // Si no se puede guardar, la app sigue funcionando igual: lo que pasa
      // es que al recargar se pierde lo que hizo el usuario.
    }
  }, [nombre, valor]);

  return [valor, setValor];
}

// Borra todo lo que guardó la aplicación y recarga la página, para volver a
// los datos de ejemplo. Lo usa el botón "Restablecer datos" del menú demo.
export function restablecerDatos() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(`${PREFIJO}:`))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Si no se pudo borrar, al menos recargamos.
  }
  window.location.href = '/';
}
