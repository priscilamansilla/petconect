// Funciones chicas para mostrar datos en pantalla.

// La edad se guarda en años, y el valor 0 significa "menos de un año".
export function edadEnTexto(edad) {
  if (edad === 0) return 'Menos de 1 año';
  return edad === 1 ? '1 año' : `${edad} años`;
}

// Las fechas se guardan como 'AAAA-MM-DD'. Hay que partirlas a mano: si se
// las pasamos enteras a new Date(), JavaScript las interpreta como UTC y en
// Argentina (UTC-3) termina mostrando el día anterior.
export function fechaEnTexto(fecha) {
  const [anio, mes, dia] = String(fecha).split('-').map(Number);
  if (!anio || !mes || !dia) return String(fecha);
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-AR');
}
