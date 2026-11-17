# PETCONECT

Plataforma de gestión y adopción responsable de mascotas.
Parcial 2 de Plataformas de Desarrollo — Escuela Da Vinci.

Esto es una **maqueta navegable**: están todas las pantallas, con datos de
ejemplo y la navegación completa entre los tres roles. La lógica de guardado
todavía no está: es lo que nos queda por repartir.

## Para verla sin instalar nada

https://petconect-davinci.web.app

Es la misma maqueta, publicada. Sirve para mirarla desde el celular y para
el día de la exposición. Para volver a publicar los cambios:

```
npm run build
firebase deploy --only hosting
```

## Cómo levantarlo

```
npm install
npm run dev
```

Se abre en http://localhost:5173.

## Cómo recorrerla

Arriba a la derecha hay un selector con la etiqueta **demo**. Desde ahí se
cambia de usuario sin pasar por el login, para ver cómo queda la aplicación
con cada rol:

- **Sofía Ramírez** — adoptante (es la que arranca logueada)
- **Marcela Ferreyra** — refugio
- **Laura Giménez** — administradora
- **Rodrigo Peralta** — adoptante desactivado, sirve para probar la RN04

Ese selector es solo de la maqueta: se borra cuando esté hecho el login.

## Qué hay armado

- Las 20 pantallas del documento, con el árbol de carpetas que propusimos.
- Los datos de ejemplo: 12 mascotas, 3 refugios, 8 usuarios y 7 solicitudes
  con su historial de cambios.
- Los filtros del catálogo funcionando de verdad (RN17).
- Favoritos: se pueden agregar y quitar (RN18).
- El puntaje de compatibilidad calculado, con el detalle de cómo se arma
  (RN19 y RN20).
- Las validaciones de los formularios (RN23).
- Las rutas protegidas por rol (RN02 y RN03).

## Qué falta y de quién es

Las funciones que faltan están escritas en los contextos, con el nombre
definitivo y un `console.warn` adentro. Buscá `TODO` en `src/context/` y vas
a encontrar todas.

**1. Parte pública** — ya está casi todo. Queda pulir el diseño, la
accesibilidad y revisar que se vea bien en celular.
Archivos: `components/layout/`, `components/pets/PetCard · PetGrid ·
PetFilters`, `pages/public/`, `utils/compatibility.js`.

**2. Login, roles y administración** — `registrar()` e `iniciarSesion()` en
`AuthContext`, y que las pantallas de admin hagan algo (activar y desactivar
usuarios, cambiar roles).
Cubre RN01, RN02, RN03, RN04, RN21 y RN23.
Archivos: `context/AuthContext.jsx`, `pages/public/Login · Register`,
`pages/admin/`, `components/common/RutaProtegida.jsx`.

**3. Refugio y solicitudes** — es el bloque más pesado. Alta y edición de
mascotas, las dos máquinas de estado y el historial.
Cubre RN05 a RN16, RN22 y RN24.
Archivos: `context/PetContext.jsx`, `context/ApplicationContext.jsx`,
`components/pets/PetForm.jsx`, `pages/shelter/`.

## Dos cosas para decidir entre las tres

1. **Las secciones 6 y 7 del documento no están escritas.** El PDF las
   nombra pero no existen. La 6 son las transiciones de estado válidas (de
   mascota y de solicitud) y la 7 son los criterios y pesos del puntaje de
   compatibilidad. Por ahora pusimos estos pesos en
   `src/utils/compatibility.js`, que son una propuesta y se pueden cambiar:
   especie 30, tamaño 25, edad 20, ubicación 15, sexo 10.

2. **Nada se guarda al recargar la página.** Todo vive en los contextos, en
   memoria. Si queremos que las solicitudes y el historial sobrevivan a un
   F5, hay que guardarlos en `localStorage`.

## Para no pisarnos

- `src/data/` está congelado: si hace falta cambiar el nombre de un campo,
  avisar primero, porque lo usamos las tres.
- `App.jsx` lo toca una sola persona por vez, es el que más conflictos da.
- Mergear todos los días aunque esté a medio hacer.

## Estructura

```
src/
  components/
    common/      EstadoBadge, PuntajeCompatibilidad, HistorialSolicitud, RutaProtegida
    layout/      Header, Footer, Layout
    pets/        PetCard, PetGrid, PetFilters, PetForm
  context/       AuthContext, PetContext, ApplicationContext, FavoritesContext
  data/          options, users, shelters, pets, applications
  pages/
    public/      Home, Pets, PetDetail, About, Contact, Login, Register, NotFound
    adopter/     AdopterDashboard, Favorites, MyApplications, Profile
    shelter/     ShelterDashboard, ShelterPets, ShelterApplications, ShelterProfile
    admin/       AdminDashboard, AdminUsers, AdminShelters, AdminPets, AdminApplications
  utils/         compatibility, validators, format
```

Las ilustraciones de las mascotas están en `public/pets/` y son SVG hechos a
mano, así que la maqueta se ve igual aunque no haya internet el día de la
presentación.
