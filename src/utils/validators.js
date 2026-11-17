// Validaciones de formularios (RN23).
// Cada función devuelve un mensaje de error o null si el valor es válido.

export function requerido(valor, campo = 'Este campo') {
  if (valor === null || valor === undefined) return `${campo} es obligatorio.`;
  if (typeof valor === 'string' && valor.trim() === '')
    return `${campo} es obligatorio.`;
  return null;
}

export function email(valor) {
  if (!valor || valor.trim() === '') return 'El correo es obligatorio.';
  const formato = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return formato.test(valor.trim())
    ? null
    : 'Escribí un correo electrónico válido.';
}

export function longitudMinima(valor, minimo, campo = 'Este campo') {
  if (!valor || valor.length < minimo)
    return `${campo} debe tener al menos ${minimo} caracteres.`;
  return null;
}

export function numeroEntre(valor, minimo, maximo, campo = 'Este valor') {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return `${campo} debe ser un número.`;
  if (numero < minimo || numero > maximo)
    return `${campo} debe estar entre ${minimo} y ${maximo}.`;
  return null;
}

// Recorre un objeto de reglas y devuelve un objeto de errores.
// Ejemplo: validarFormulario({ nombre: [() => requerido(datos.nombre)] })
export function validarFormulario(reglas) {
  const errores = {};
  for (const [campo, validaciones] of Object.entries(reglas)) {
    for (const validar of validaciones) {
      const error = validar();
      if (error) {
        errores[campo] = error;
        break;
      }
    }
  }
  return errores;
}
