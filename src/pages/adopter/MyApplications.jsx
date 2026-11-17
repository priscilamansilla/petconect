import { Accordion, Alert, Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EstadoSolicitud } from '../../components/common/EstadoBadge';
import HistorialSolicitud from '../../components/common/HistorialSolicitud';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../context/PetContext';
import { ESTADOS_SOLICITUD } from '../../data/options';
import { fechaEnTexto } from '../../utils/format';

export default function MyApplications() {
  const { usuarioActual } = useAuth();
  const { solicitudesDeAdoptante } = useApplications();
  const { obtenerMascota, obtenerRefugio } = usePets();

  const mias = solicitudesDeAdoptante(usuarioActual.id);

  const activas = mias.filter((s) =>
    [ESTADOS_SOLICITUD.PENDIENTE, ESTADOS_SOLICITUD.EN_EVALUACION].includes(
      s.estado,
    ),
  );

  return (
    <Container className="py-5">
      <h1 className="h2 mb-1">Mis solicitudes</h1>
      <p className="text-body-secondary mb-4">
        Tenés {mias.length} {mias.length === 1 ? 'solicitud' : 'solicitudes'} en
        total, {activas.length} en curso.
      </p>

      {mias.length === 0 && (
        <Alert variant="light" className="border">
          Todavía no enviaste ninguna solicitud.{' '}
          <Alert.Link as={Link} to="/mascotas">
            Mirá las mascotas disponibles
          </Alert.Link>
          .
        </Alert>
      )}

      <Row className="g-4">
        {mias.map((solicitud) => {
          const mascota = obtenerMascota(solicitud.mascotaId);
          const refugio = obtenerRefugio(mascota?.refugioId);

          return (
            <Col lg={6} key={solicitud.id}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex align-items-start gap-3">
                    <img
                      src={mascota?.foto}
                      alt=""
                      className="pc-miniatura"
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <h2 className="h5 mb-1">{mascota?.nombre}</h2>
                        <EstadoSolicitud estado={solicitud.estado} />
                      </div>
                      <p className="small text-body-secondary mb-2">
                        {refugio?.nombre} · Enviada el{' '}
                        {fechaEnTexto(solicitud.fecha)}
                      </p>
                      <p className="small mb-0 fst-italic">
                        «{solicitud.mensaje}»
                      </p>
                    </div>
                  </div>

                  <Accordion flush className="mt-3">
                    <Accordion.Item eventKey="historial">
                      <Accordion.Header>
                        Ver historial{' '}
                        <Badge bg="light" text="dark" className="ms-2">
                          {solicitud.historial.length}
                        </Badge>
                      </Accordion.Header>
                      <Accordion.Body>
                        <HistorialSolicitud historial={solicitud.historial} />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Card.Body>

                <Card.Footer className="bg-transparent d-flex gap-2">
                  <Button
                    as={Link}
                    to={`/mascotas/${mascota?.id}`}
                    size="sm"
                    variant="outline-primary"
                  >
                    Ver mascota
                  </Button>
                  {[
                    ESTADOS_SOLICITUD.PENDIENTE,
                    ESTADOS_SOLICITUD.EN_EVALUACION,
                  ].includes(solicitud.estado) && (
                    <Button size="sm" variant="outline-secondary" disabled>
                      Cancelar solicitud
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
