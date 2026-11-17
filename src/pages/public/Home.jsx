import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PetGrid from '../../components/pets/PetGrid';
import { usePets } from '../../context/PetContext';

const PASOS = [
  {
    icono: '🔎',
    titulo: 'Buscá',
    texto:
      'Filtrá por especie, tamaño, edad, sexo y zona hasta encontrar la mascota que se adapta a tu casa.',
  },
  {
    icono: '💚',
    titulo: 'Fijate si coinciden',
    texto:
      'Cargá tus preferencias y la plataforma te muestra qué tan compatible sos con cada mascota.',
  },
  {
    icono: '📩',
    titulo: 'Mandá la solicitud',
    texto:
      'El refugio responsable la revisa, te contacta y define si la adopción sigue adelante.',
  },
];

export default function Home() {
  const { disponibles, refugios } = usePets();
  const destacadas = disponibles.slice(0, 4);

  return (
    <>
      <section className="pc-hero">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={7}>
              <h1 className="display-5 fw-bold mb-3">
                Cada mascota necesita una familia que le quede bien
              </h1>
              <p className="lead mb-4">
                PETCONECT conecta adoptantes con refugios de la zona. Buscá por
                las características que te importan y encontrá a tu próximo
                compañero sin dar vueltas.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Button as={Link} to="/mascotas" size="lg" variant="primary">
                  Ver mascotas en adopción
                </Button>
                <Button
                  as={Link}
                  to="/registrarme"
                  size="lg"
                  variant="outline-light"
                >
                  Crear una cuenta
                </Button>
              </div>
            </Col>
            <Col lg={5} className="text-center d-none d-lg-block">
              <div className="pc-hero-circulo" aria-hidden="true">
                🐶
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h3 mb-1">Esperando un hogar</h2>
            <p className="text-body-secondary mb-0">
              Algunas de las mascotas disponibles en este momento.
            </p>
          </div>
          <Button as={Link} to="/mascotas" variant="outline-primary">
            Ver todas
          </Button>
        </div>
        <PetGrid mascotas={destacadas} />
      </Container>

      <section className="pc-seccion-clara py-5">
        <Container>
          <h2 className="h3 text-center mb-4">Cómo funciona</h2>
          <Row className="g-4">
            {PASOS.map((paso) => (
              <Col md={4} key={paso.titulo}>
                <Card className="h-100 border-0 text-center p-3">
                  <div className="fs-1" aria-hidden="true">
                    {paso.icono}
                  </div>
                  <Card.Body>
                    <Card.Title as="h3" className="h5">
                      {paso.titulo}
                    </Card.Title>
                    <Card.Text className="text-body-secondary">
                      {paso.texto}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <h2 className="h3 mb-4">Refugios que publican en PETCONECT</h2>
        <Row className="g-4">
          {refugios.map((refugio) => (
            <Col md={4} key={refugio.id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title as="h3" className="h5">
                    {refugio.nombre}
                  </Card.Title>
                  <p className="text-body-secondary small mb-2">
                    <span aria-hidden="true">📍</span> {refugio.ciudad}
                  </p>
                  <Card.Text className="small">{refugio.descripcion}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
