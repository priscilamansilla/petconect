import { Badge, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EstadoMascota } from '../common/EstadoBadge';
import PuntajeCompatibilidad from '../common/PuntajeCompatibilidad';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { calcularCompatibilidad } from '../../utils/compatibility';
import { edadEnTexto } from '../../utils/format';

export default function PetCard({ mascota }) {
  const { usuarioActual, esAdoptante } = useAuth();
  const { esFavorito, alternarFavorito } = useFavorites();

  const favorito = esFavorito(mascota.id);
  const compatibilidad =
    esAdoptante && usuarioActual?.preferencias
      ? calcularCompatibilidad(usuarioActual.preferencias, mascota)
      : null;

  return (
    <Card className="h-100 pc-card">
      <div className="pc-card-foto">
        <Card.Img variant="top" src={mascota.foto} alt={`Foto de ${mascota.nombre}`} />
        {esAdoptante && (
          <Button
            variant="light"
            className="pc-boton-favorito"
            onClick={() => alternarFavorito(mascota.id)}
            aria-pressed={favorito}
            aria-label={
              favorito
                ? `Quitar a ${mascota.nombre} de favoritos`
                : `Agregar a ${mascota.nombre} a favoritos`
            }
          >
            <span aria-hidden="true">{favorito ? '❤️' : '🤍'}</span>
          </Button>
        )}
        <div className="pc-card-estado">
          <EstadoMascota estado={mascota.estado} />
        </div>
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-1">{mascota.nombre}</Card.Title>
        <p className="text-body-secondary small mb-2">
          <span aria-hidden="true">📍</span> {mascota.ciudad}
        </p>

        <div className="d-flex flex-wrap gap-1 mb-3">
          <Badge bg="light" text="dark">{mascota.especie}</Badge>
          <Badge bg="light" text="dark">{mascota.sexo}</Badge>
          <Badge bg="light" text="dark">{mascota.tamano}</Badge>
          <Badge bg="light" text="dark">{edadEnTexto(mascota.edad)}</Badge>
        </div>

        {compatibilidad && (
          <div className="mb-3">
            <PuntajeCompatibilidad puntaje={compatibilidad.puntaje} compacto />
          </div>
        )}

        <Button
          as={Link}
          to={`/mascotas/${mascota.id}`}
          variant="primary"
          className="mt-auto w-100"
        >
          Ver detalle
        </Button>
      </Card.Body>
    </Card>
  );
}
