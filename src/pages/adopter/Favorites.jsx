import { Container } from 'react-bootstrap';
import PetGrid from '../../components/pets/PetGrid';
import { useFavorites } from '../../context/FavoritesContext';
import { usePets } from '../../context/PetContext';

export default function Favorites() {
  const { favoritosDelUsuario } = useFavorites();
  const { mascotas } = usePets();

  const ids = favoritosDelUsuario();
  const guardadas = mascotas.filter((m) => ids.includes(m.id));

  return (
    <Container className="py-5">
      <h1 className="h2 mb-1">Mis favoritos</h1>
      <p className="text-body-secondary mb-4">
        Las mascotas que guardaste para mirar más tranquila.
      </p>

      <PetGrid
        mascotas={guardadas}
        vacio="Todavía no guardaste ninguna mascota. Tocá el corazón en cualquier tarjeta para agregarla acá."
      />
    </Container>
  );
}
