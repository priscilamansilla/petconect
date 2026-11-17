import { createContext, useContext } from 'react';
import { mascotas as mascotasIniciales } from '../data/pets';
import { refugios } from '../data/shelters';
import { ESTADOS_MASCOTA, RANGOS_EDAD } from '../data/options';
import { useEstadoGuardado } from '../hooks/useEstadoGuardado';

const PetContext = createContext(null);

export function PetProvider({ children }) {
  const [mascotas, setMascotas] = useEstadoGuardado(
    'mascotas',
    mascotasIniciales,
  );

  function obtenerMascota(id) {
    return mascotas.find((m) => m.id === Number(id)) ?? null;
  }

  function obtenerRefugio(id) {
    return refugios.find((r) => r.id === Number(id)) ?? null;
  }

  function mascotasDeRefugio(refugioId) {
    return mascotas.filter((m) => m.refugioId === Number(refugioId));
  }

  // RN17: los filtros seleccionados se aplican todos juntos.
  function filtrar(filtros) {
    return mascotas.filter((mascota) => {
      if (filtros.especie && mascota.especie !== filtros.especie) return false;
      if (filtros.tamano && mascota.tamano !== filtros.tamano) return false;
      if (filtros.sexo && mascota.sexo !== filtros.sexo) return false;
      if (filtros.ciudad && mascota.ciudad !== filtros.ciudad) return false;
      if (filtros.estado && mascota.estado !== filtros.estado) return false;

      if (filtros.rangoEdad) {
        const rango = RANGOS_EDAD.find((r) => r.id === filtros.rangoEdad);
        if (rango && (mascota.edad < rango.min || mascota.edad >= rango.max))
          return false;
      }

      if (filtros.texto) {
        const texto = filtros.texto.toLowerCase();
        const coincide =
          mascota.nombre.toLowerCase().includes(texto) ||
          mascota.descripcion.toLowerCase().includes(texto);
        if (!coincide) return false;
      }

      return true;
    });
  }

  // --- Lo que falta implementar (bloque de refugio) ----------------------

  // RN05: alta de una publicación con todos los campos obligatorios.
  function publicarMascota(datos) {
    console.warn('TODO publicarMascota()', datos);
  }

  // RN06: un refugio solo puede modificar las mascotas que administra.
  function editarMascota(id, datos) {
    console.warn('TODO editarMascota()', id, datos);
  }

  // RN08: los cambios de estado tienen que respetar las transiciones válidas.
  function cambiarEstado(id, nuevoEstado) {
    console.warn('TODO cambiarEstado()', id, nuevoEstado);
  }

  // RN09: una mascota con solicitudes no se elimina, se desactiva.
  function eliminarMascota(id) {
    console.warn('TODO eliminarMascota()', id);
  }

  // -----------------------------------------------------------------------

  const valor = {
    mascotas,
    setMascotas,
    refugios,
    disponibles: mascotas.filter(
      (m) => m.estado === ESTADOS_MASCOTA.DISPONIBLE,
    ),
    obtenerMascota,
    obtenerRefugio,
    mascotasDeRefugio,
    filtrar,
    publicarMascota,
    editarMascota,
    cambiarEstado,
    eliminarMascota,
  };

  return <PetContext.Provider value={valor}>{children}</PetContext.Provider>;
}

export function usePets() {
  const contexto = useContext(PetContext);
  if (!contexto)
    throw new Error('usePets tiene que usarse dentro de <PetProvider>');
  return contexto;
}
