import { Card, Col, Container, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EstadoSolicitud } from '../../components/common/EstadoBadge';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../context/PetContext';
import { ESTADOS_MASCOTA, ESTADOS_SOLICITUD } from '../../data/options';
import { fechaEnTexto } from '../../utils/format';

export default function ShelterDashboard() {
  const { usuarioActual } = useAuth();
  const { mascotasDeRefugio, obtenerRefugio, obtenerMascota } = usePets();
  const { solicitudes } = useApplications();

  const refugio = obtenerRefugio(usuarioActual.refugioId);
  const mias = mascotasDeRefugio(usuarioActual.refugioId);
  const idsMascotas = mias.map((m) => m.id);
  const solicitudesDelRefugio = solicitudes.filter((s) =>
    idsMascotas.includes(s.mascotaId),
  );

  const tarjetas = [
    {
      etiqueta: 'Publicaciones',
      valor: mias.length,
      detalle: 'mascotas cargadas',
    },
    {
      etiqueta: 'Disponibles',
      valor: mias.filter((m) => m.estado === ESTADOS_MASCOTA.DISPONIBLE).length,
      detalle: 'reciben solicitudes',
    },
    {
      etiqueta: 'Pendientes',
      valor: solicitudesDelRefugio.filter(
        (s) => s.estado === ESTADOS_SOLICITUD.PENDIENTE,
      ).length,
      detalle: 'solicitudes sin abrir',
    },
    {
      etiqueta: 'En evaluación',
      valor: solicitudesDelRefugio.filter(
        (s) => s.estado === ESTADOS_SOLICITUD.EN_EVALUACION,
      ).length,
      detalle: 'en proceso',
    },
  ];

  const ultimas = [...solicitudesDelRefugio]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 5);

  return (
    <Container className="py-5">
      <h1 className="h2 mb-1">Panel del refugio</h1>
      <p className="text-body-secondary mb-4">{refugio?.nombre}</p>

      <Row className="g-3 mb-4">
        {tarjetas.map((t) => (
          <Col xs={6} lg={3} key={t.etiqueta}>
            <Card className="h-100 text-center">
              <Card.Body>
                <p className="display-6 fw-bold mb-0">{t.valor}</p>
                <p className="fw-semibold mb-0">{t.etiqueta}</p>
                <p className="small text-body-secondary mb-0">{t.detalle}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Últimas solicitudes</span>
          <Link to="/refugio/solicitudes" className="small">
            Ver todas
          </Link>
        </Card.Header>
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th scope="col">Mascota</th>
              <th scope="col">Fecha</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {ultimas.map((solicitud) => (
              <tr key={solicitud.id}>
                <td>{obtenerMascota(solicitud.mascotaId)?.nombre}</td>
                <td>{fechaEnTexto(solicitud.fecha)}</td>
                <td>
                  <EstadoSolicitud estado={solicitud.estado} />
                </td>
              </tr>
            ))}
            {ultimas.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-body-secondary py-4">
                  Todavía no hay solicitudes para las mascotas del refugio.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}
