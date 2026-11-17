// Funciones chicas para mostrar datos en pantalla.

// La edad se guarda en años, y el valor 0 significa "menos de un año".
export function edadEnTexto(edad) {
  if (edad === 0) return 'Menos de 1 año';
  return edad === 1 ? '1 año' : `${edad} años`;
}

export function fechaEnTexto(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR');
}
