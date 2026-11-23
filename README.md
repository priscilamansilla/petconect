# PetConnect

**Plataforma web para la adopción responsable de mascotas**

Trabajo práctico de Plataformas de Desarrollo — Escuela Da Vinci

## Integrantes

- Juana Romero
- Priscilla Mansilla
- Antonella Capello

## Sobre el proyecto

PetConect+ es una plataforma web para la gestión y adopción responsable de mascotas. La plataforma busca conectar a adoptantes con refugios y ofrece un sistema de compatibilidad orientativo entre el perfil del adoptante y las características de cada animal(esta compatibilidad no es determinativa a la hora de procesar una solicitud)

## Roles

- Adoptante: explora el catálogo, guarda mascotas favoritas, gestiona su perfil y consulta sus solicitudes.
- Refugio: administra sus publicaciones y revisa solicitudes de adopción relacionadas con sus mascotas.
- Administrador: gestiona usuarios, mascotas y refugios, y supervisa las solicitudes.

Las pantallas y acciones disponibles dependen del rol con el que se ingresa a la aplicación.

## Funcionalidades principales

- Catálogo de mascotas con búsqueda, filtros y vista de detalle.
- Compatibilidad orientativa según el perfil del adoptante y las características de la mascota.
- Registro e inicio y cierre de sesión para la demostración.
- Favoritos y seguimiento de solicitudes de adopción.
- Solicitudes con estados e historial de cambios.
- Paneles para adoptantes, refugios y administración.
- Gestión administrativa de usuarios, mascotas y refugios.
- Componentes visuales reutilizables y diseño adaptable.

## Tecnologías y datos

El proyecto utiliza React, JavaScript, HTML y CSS. La interfaz se construye con React Bootstrap y Bootstrap, y la navegación con React Router. Vite se utiliza para ejecutar el entorno de desarrollo y generar la compilación.

Los datos iniciales están definidos en JavaScript dentro de `src/data`. La aplicación no consume APIs ni utiliza un backend o una base de datos externa. Los cambios de la demostración se guardan en `localStorage` del navegador; por ese motivo, cada navegador conserva sus propios datos.

## Ejecutar el proyecto

Se requiere Node.js y npm. Desde la carpeta del proyecto, instalá las dependencias y ejecutá el servidor de desarrollo:

```bash
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación.

Para generar la versión compilada:

```bash
npm run build
```

Para verla localmente:

```bash
npm run preview
```

## Cuentas de demostración

Las cuentas de ejemplo están definidas en `src/data/users.js`. Para la demostración, todas utilizan la contraseña `1234`.

| Rol | Correo |
|---|---|
| Administradora | `admin@petconect.com` |
| Refugio | `contacto@patitasdeloeste.org` |
| Adoptante | `sofia.ramirez@gmail.com` |
| Adoptante desactivado | `rodrigo.peralta@gmail.com` |

El selector “demo” permite cambiar entre usuarios de ejemplo. Estas cuentas y contraseñas son ficticias y sirven únicamente para probar el prototipo; no representan un sistema de autenticación seguro para producción.

## Organización del código

```text
src/
  components/   Componentes visuales reutilizables
  context/      Estado compartido de usuarios, mascotas y solicitudes
  data/         Datos iniciales y opciones de la aplicación
  hooks/        Hooks reutilizables y persistencia local
  pages/        Vistas públicas y paneles según el rol
  utils/        Validaciones, reglas de negocio y funciones auxiliares
```
