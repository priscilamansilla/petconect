import { useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import PetFilters from '../../components/pets/PetFilters';
import PetGrid from '../../components/pets/PetGrid';
import { usePets } from '../../context/PetContext';

const SIN_FILTROS = {
  texto: '',
  especie: '',
  tamano: '',
  rangoEdad: '',
  sexo: '',
  ciudad: '',
  estado: '',
};

export default function Pets() {
  const { filtrar, mascotas } = usePets();
  const [filtros, setFiltros] = useState(SIN_FILTROS);

  // Los filtros se aplican todos juntos (RN17).
  const resultados = useMemo(
    () => filtrar(filtros),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtros, mascotas],
  );

  return (
    <Container className="py-5">
      <h1 className="h2 mb-1">Mascotas en adopción</h1>
      <p className="text-body-secondary mb-4">
        Usá los filtros para encontrar la que mejor se adapta a tu casa y a tu
        rutina.
      </p>

      <PetFilters
        filtros={filtros}
        onCambiar={setFiltros}
        onLimpiar={() => setFiltros(SIN_FILTROS)}
        resultados={resultados.length}
      />

      <PetGrid
        mascotas={resultados}
        vacio="No encontramos mascotas con esos filtros. Probá quitando alguno."
      />
    </Container>
  );
}
