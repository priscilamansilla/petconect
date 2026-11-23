# PetConnect

**Plataforma de adopción responsable de mascotas**

Trabajo práctico de Plataformas de Desarrollo — Escuela Da Vinci

## Integrantes

- Juana Romero
- Priscilla Mansilla
- 

## Sobre el proyecto

PetConnect es una aplicación web ficticia que conecta personas interesadas en adoptar con refugios de animales. Busca organizar el catálogo de mascotas y acompañar el proceso de adopción mediante perfiles, solicitudes y herramientas de gestión.

La información de ejemplo está definida en JavaScript dentro de src/data. La aplicación no consume APIs ni utiliza un backend o una base de datos externa. Para conservar los cambios entre recargas, utiliza localStorage en el navegador; por eso, esos cambios quedan guardados localmente en cada navegador.

## Roles

- **Adoptante:** explora mascotas, guarda favoritas, gestiona su perfil y consulta sus solicitudes.
- **Refugio:** administra sus publicaciones y revisa solicitudes de adopción.
- **Administrador:** gestiona usuarios, refugios y mascotas, y supervisa solicitudes de adopción.

## Funcionalidades

- Catálogo de mascotas con búsqueda y filtros.
- Detalle de cada mascota y cálculo orientativo de compatibilidad con las preferencias del adoptante.
- Registro, inicio y cierre de sesión para la demostración.
- Solicitudes de adopción con estados e historial de cambios.
- Paneles separados según el rol.
- Gestión administrativa de usuarios, refugios y mascotas.
- Datos de ejemplo y almacenamiento local en el navegador.
- Componentes visuales reutilizables y diseño adaptable con React Bootstrap.

Las solicitudes implementadas son postulaciones para adoptar mascotas. No se administran solicitudes de voluntariado.

## Tecnologías

- React y JavaScript
- HTML y CSS
- Vite
- React Bootstrap y Bootstrap
- React Router
- localStorage para persistencia local

## Cómo ejecutar el proyecto

Se requiere Node.js y npm.

~~~bash
npm install
npm run dev
~~~

Vite mostrará en la terminal la dirección local para abrir la aplicación.

Para generar la versión compilada:

~~~bash
npm run build
~~~

Para previsualizar la compilación:

~~~bash
npm run preview
~~~

## Cuentas de demostración

Las cuentas de ejemplo se encuentran en src/data/users.js. Todas usan la contraseña 1234.

| Rol | Correo |
|---|---|
| Administradora | admin@petconect.com |
| Refugio | contacto@patitasdeloeste.org |
| Adoptante | sofia.ramirez@gmail.com |
| Adoptante desactivado | rodrigo.peralta@gmail.com |

La aplicación incluye un selector “demo” para cambiar entre usuarios de ejemplo. Es una ayuda de demostración del prototipo; las credenciales también permiten probar el formulario de inicio de sesión. Las cuentas y contraseñas son datos ficticios de prueba, no deben usarse como autenticación segura en un servicio real.

## Datos de ejemplo

Los datos iniciales están organizados en:

- src/data/users.js: usuarios y roles.
- src/data/shelters.js: refugios.
- src/data/pets.js: mascotas.
- src/data/applications.js: solicitudes de adopción e historial.
- src/data/options.js: roles y estados permitidos.

El menú “demo” incluye una opción para restablecer los datos de ejemplo. Como la persistencia usa localStorage, abrir la aplicación en otro navegador o dispositivo muestra su propio almacenamiento local.

## Estructura principal

~~~text
src/
  components/   Componentes visuales reutilizables
  context/      Estado compartido de usuarios, mascotas y solicitudes
  data/         Datos iniciales hardcodeados
  hooks/        Hooks reutilizables, incluido el guardado local
  pages/        Vistas públicas, de adoptantes, refugios y administración
  utils/        Validaciones, reglas de negocio y formato
~~~

## Publicación

La configuración de Firebase está destinada al hosting estático de la carpeta dist. Para compilar:

~~~bash
npm run build
~~~

Si el entorno de entrega tiene Firebase CLI configurado, se puede publicar con:

~~~bash
firebase deploy --only hosting
~~~
