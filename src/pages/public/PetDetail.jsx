import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { EstadoMascota } from '../../components/common/EstadoBadge';
import PuntajeCompatibilidad from '../../components/common/PuntajeCompatibilidad';
import { edadEnTexto, fechaEnTexto } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../context/PetContext';
import { useApplications } from '../../context/ApplicationContext';
import { useFavorites } from '../../context/FavoritesContext';
import { calcularCompatibilidad } from '../../utils/compatibility';
import { ESTADOS_MASCOTA } from '../../data/options';

export default function PetDetail() {
  const { id } = useParams();
  const { obtenerMascota, obtenerRefugio } = usePets();
  const { usuarioActual, esAdoptante } = useAuth();
  const { tieneSolicitudActiva } = useApplications();
  const { esFavorito, alternarFavorito } = useFavorites();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [enviada, setEnviada] = useState(false);

  const mascota = obtenerMascota(id);

  if (!mascota) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          No encontramos esa mascota.{' '}
          <Alert.Link as={Link} to="/mascotas">
            Volver al listado
          </Alert.Link>
        </Alert>
      </Container>
    );
  }

  const refugio = obtenerRefugio(mascota.refugioId);
  const compatibilidad =
    esAdoptante && usuarioActual?.preferencias
      ? calcularCompatibilidad(usuarioActual.preferencias, mascota)
      : null;

  // RN07: solo las mascotas disponibles reciben solicitudes nuevas.
  const disponible = mascota.estado === ESTADOS_MASCOTA.DISPONIBLE;
  // RN11: no puede haber dos solicitudes activas del mismo adoptante.
  const yaSolicito =
    esAdoptante && tieneSolicitudActiva(usuarioActual.id, mascota.id);
  // RN10: solo adoptantes registrados y activos pueden solicitar.
  const puedeSolicitar =
    esAdoptante && usuarioActual.activo && disponible && !yaSolicito;

  const caracteristicas = [
    ['Vacunado', mascota.vacunado],
    ['Castrado', mascota.castrado],
    ['Apto para chicos', mascota.aptoNinos],
    ['Apto departamento', mascota.aptoDepartamento],
  ];

  return (
    <Container className="py-5">
      <Link to="/mascotas" className="small">
        ← Volver al listado
      </Link>

      <Row className="g-4 mt-1">
        <Col lg={5}>
          <Card className="overflow-hidden">
            <img
              src={mascota.foto}
              alt={`Foto de ${mascota.nombre}`}
              className="w-100"
            />
          </Card>

          {esAdoptante && (
            <Button
              variant={esFavorito(mascota.id) ? 'danger' : 'outline-danger'}
              className="w-100 mt-3"
              onClick={() => alternarFavorito(mascota.id)}
              aria-pressed={esFavorito(mascota.id)}
            >
              {esFavorito(mascota.id)
                ? 'Quitar de favoritos'
                : 'Agregar a favoritos'}
            </Button>
          )}
        </Col>

        <Col lg={7}>
          <div className="d-flex align-items-center gap-3 mb-2">
            <h1 className="h2 mb-0">{mascota.nombre}</h1>
            <EstadoMascota estado={mascota.estado} />
          </div>
          <p className="text-body-secondary mb-3">
            <span aria-hidden="true">📍</span> {mascota.ciudad} · Publicada el{' '}
            {fechaEnTexto(mascota.fechaPublicacion)}
          </p>

          <div className="d-flex flex-wrap gap-2 mb-4">
            <Badge bg="light" text="dark" className="fs-6">
              {mascota.especie}
            </Badge>
            <Badge bg="light" text="dark" className="fs-6">
              {mascota.sexo}
            </Badge>
            <Badge bg="light" text="dark" className="fs-6">
              Tamaño {mascota.tamano.toLowerCase()}
            </Badge>
            <Badge bg="light" text="dark" className="fs-6">
              {edadEnTexto(mascota.edad)}
            </Badge>
          </div>

          <p>{mascota.descripcion}</p>

          <ul className="list-unstyled d-flex flex-wrap gap-3 my-4">
            {caracteristicas.map(([etiqueta, valor]) => (
              <li key={etiqueta} className="small">
                <span aria-hidden="true">{valor ? '✅' : '➖'}</span> {etiqueta}
                {!valor && <span className="visually-hidden"> (no)</span>}
              </li>
            ))}
          </ul>

          {compatibilidad && (
            <Card className="mb-4">
              <Card.Body>
                <h2 className="h5">Compatibilidad con tu perfil</h2>
                <PuntajeCompatibilidad puntaje={compatibilidad.puntaje} />
                <Table size="sm" className="mt-3 mb-2 align-middle">
                  <thead>
                    <tr>
                      <th scope="col">Criterio</th>
                      <th scope="col">Tu preferencia</th>
                      <th scope="col">{mascota.nombre}</th>
                      <th scope="col" className="text-end">
                        Puntos
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {compatibilidad.detalle.map((fila) => (
                      <tr key={fila.criterio}>
                        <td>{fila.criterio}</td>
                        <td className="text-body-secondary">
                          {fila.esperado || 'Sin preferencia'}
                        </td>
                        <td>{fila.obtenido}</td>
                        <td className="text-end">
                          {fila.puntos} / {fila.peso}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <p className="small text-body-secondary mb-0">
                  El puntaje es orientativo. La evaluación de la adopción la
                  hace siempre el refugio.
                </p>
              </Card.Body>
            </Card>
          )}

          <Card className="mb-4">
            <Card.Body>
              <h2 className="h5 mb-1">Refugio responsable</h2>
              <p className="fw-semibold mb-1">{refugio?.nombre}</p>
              <p className="small text-body-secondary mb-0">
                {refugio?.ciudad} · {refugio?.email} · {refugio?.telefono}
              </p>
            </Card.Body>
          </Card>

          {enviada && (
            <Alert variant="success">
              Solicitud enviada. El refugio la va a revisar y te va a
              contactar. (En la maqueta todavía no se guarda.)
            </Alert>
          )}

          {!disponible && (
            <Alert variant="secondary">
              Esta mascota no está recibiendo solicitudes porque su estado es
              «{mascota.estado}».
            </Alert>
          )}

          {yaSolicito && (
            <Alert variant="info">
              Ya tenés una solicitud activa para {mascota.nombre}. Podés
              seguirla desde{' '}
              <Alert.Link as={Link} to="/mis-solicitudes">
                Mis solicitudes
              </Alert.Link>
              .
            </Alert>
          )}

          {!usuarioActual && (
            <Alert variant="light" className="border">
              Para solicitar una adopción tenés que{' '}
              <Alert.Link as={Link} to="/ingresar">
                iniciar sesión
              </Alert.Link>{' '}
              con una cuenta de adoptante.
            </Alert>
          )}

          <Button
            size="lg"
            variant="primary"
            disabled={!puedeSolicitar}
            onClick={() => setMostrarModal(true)}
          >
            Solicitar adopción
          </Button>
        </Col>
      </Row>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5">
            Solicitar la adopción de {mascota.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="solicitud-mensaje">
            <Form.Label>
              Contale al refugio por qué querés adoptarlo y cómo es tu casa
            </Form.Label>
            <Form.Control as="textarea" rows={5} />
            <Form.Text>
              El refugio usa esta información para evaluar la solicitud.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setMostrarModal(false);
              setEnviada(true);
            }}
          >
            Enviar solicitud
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
