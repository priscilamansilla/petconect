import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { ESTADOS_SOLICITUD } from '../../data/options';

export default function AdopterDashboard() {
  const { usuarioActual } = useAuth();
  const { solicitudesDeAdoptante } = useApplications();
  const { favoritosDelUsuario } = useFavorites();

  const mias = solicitudesDeAdoptante(usuarioActual.id);
  const activas = mias.filter((s) =>
    [ESTADOS_SOLICITUD.PENDIENTE, ESTADOS_SOLICITUD.EN_EVALUACION].includes(
      s.estado,
    ),
  );

  const accesos = [
    {
      titulo: 'Mis favoritos',
      valor: favoritosDelUsuario().length,
      texto: 'mascotas guardadas',
      ruta: '/favoritos',
      icono: '❤️',
    },
    {
      titulo: 'Mis solicitudes',
      valor: activas.length,
      texto: 'en curso',
      ruta: '/mis-solicitudes',
      icono: '📋',
    },
    {
      titulo: 'Mi perfil',
      valor: usuarioActual.preferencias ? '✓' : '—',
      texto: 'preferencias cargadas',
      ruta: '/perfil',
      icono: '⚙️',
    },
  ];

  return (
    <Container className="py-5">
      <h1 className="h2 mb-1">Hola, {usuarioActual.nombre}</h1>
      <p className="text-body-secondary mb-4">
        Desde acá seguís tus adopciones y ajustás lo que estás buscando.
      </p>

      <Row className="g-4">
        {accesos.map((acceso) => (
          <Col md={4} key={acceso.titulo}>
            <Card as={Link} to={acceso.ruta} className="h-100 pc-card-enlace">
              <Card.Body>
                <div className="fs-2 mb-2" aria-hidden="true">
                  {acceso.icono}
                </div>
                <Card.Title as="h2" className="h5 mb-1">
                  {acceso.titulo}
                </Card.Title>
                <p className="mb-0">
                  <span className="fs-4 fw-bold">{acceso.valor}</span>{' '}
                  <span className="text-body-secondary small">
                    {acceso.texto}
                  </span>
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
