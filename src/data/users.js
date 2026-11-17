import { ROLES } from './options';

// Usuarios de ejemplo (RN01). Cada uno tiene un rol asignado (RN02).
//
// Nota: las contraseñas están escritas en texto plano porque es una maqueta
// con datos de prueba. Un sistema real nunca las guardaría así.
//
// Los adoptantes tienen además un objeto "preferencias", que es lo que el
// sistema compara contra las características de cada mascota para calcular
// el puntaje de compatibilidad (RN19, RN20).

export const usuarios = [
  {
    id: 1,
    nombre: 'Laura',
    apellido: 'Giménez',
    email: 'admin@petconect.com',
    password: '1234',
    ciudad: 'CABA',
    rol: ROLES.ADMIN,
    activo: true,
    refugioId: null,
    preferencias: null,
  },
  {
    id: 2,
    nombre: 'Marcela',
    apellido: 'Ferreyra',
    email: 'contacto@patitasdeloeste.org',
    password: '1234',
    ciudad: 'Moreno',
    rol: ROLES.REFUGIO,
    activo: true,
    refugioId: 1,
    preferencias: null,
  },
  {
    id: 3,
    nombre: 'Diego',
    apellido: 'Sosa',
    email: 'hola@hogarcuatropatas.org',
    password: '1234',
    ciudad: 'Morón',
    rol: ROLES.REFUGIO,
    activo: true,
    refugioId: 2,
    preferencias: null,
  },
  {
    id: 4,
    nombre: 'Valeria',
    apellido: 'Ponce',
    email: 'info@huellitas.org.ar',
    password: '1234',
    ciudad: 'CABA',
    rol: ROLES.REFUGIO,
    activo: true,
    refugioId: 3,
    preferencias: null,
  },
  {
    id: 5,
    nombre: 'Sofía',
    apellido: 'Ramírez',
    email: 'sofia.ramirez@gmail.com',
    password: '1234',
    ciudad: 'Moreno',
    rol: ROLES.ADOPTANTE,
    activo: true,
    refugioId: null,
    preferencias: {
      especie: 'Perro',
      tamano: 'Mediano',
      rangoEdad: 'joven',
      sexo: 'Hembra',
      ciudad: 'Moreno',
    },
  },
  {
    id: 6,
    nombre: 'Martín',
    apellido: 'Quiroga',
    email: 'martin.quiroga@gmail.com',
    password: '1234',
    ciudad: 'Haedo',
    rol: ROLES.ADOPTANTE,
    activo: true,
    refugioId: null,
    preferencias: {
      especie: 'Gato',
      tamano: 'Pequeño',
      rangoEdad: 'cachorro',
      sexo: 'Macho',
      ciudad: 'Haedo',
    },
  },
  {
    id: 7,
    nombre: 'Camila',
    apellido: 'Ibarra',
    email: 'camila.ibarra@gmail.com',
    password: '1234',
    ciudad: 'Ramos Mejía',
    rol: ROLES.ADOPTANTE,
    activo: true,
    refugioId: null,
    preferencias: {
      especie: 'Perro',
      tamano: 'Grande',
      rangoEdad: 'adulto',
      sexo: 'Macho',
      ciudad: 'Ramos Mejía',
    },
  },
  {
    // Usuario desactivado: sirve para probar la RN04.
    id: 8,
    nombre: 'Rodrigo',
    apellido: 'Peralta',
    email: 'rodrigo.peralta@gmail.com',
    password: '1234',
    ciudad: 'Morón',
    rol: ROLES.ADOPTANTE,
    activo: false,
    refugioId: null,
    preferencias: {
      especie: 'Perro',
      tamano: 'Pequeño',
      rangoEdad: 'senior',
      sexo: 'Hembra',
      ciudad: 'Morón',
    },
  },
];
