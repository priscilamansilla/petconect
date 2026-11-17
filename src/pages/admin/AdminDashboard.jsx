import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../context/PetContext';
import { ESTADOS_MASCOTA, ESTADOS_SOLICITUD } from '../../data/options';

const SECCIONES = [
  {
    titulo: 'Usuarios',
    texto: 'Alta, baja y cambio de rol de las cuentas.',
    ruta: '/admin/usuarios',
    icono: '👥',
  },
  {
    titulo: 'Refugios',
    texto: 'Refugios asociados y sus publicaciones.',
    ruta: '/admin/refugios',
    icono: '🏠',
  },
  {
    titulo: 'Mascotas',
    texto: 'Todas las publicaciones de la plataforma.',
    ruta: '/admin/mascotas',
    icono: '🐾',
  },
  {
    titulo: 'Solicitudes',
    texto: 'Supervisión de las solicitudes de adopción.',
    ruta: '/admin/solicitudes',
    icono: '📋',
  },
];

export default function AdminDashboard() {
  const { usuarios } = useAuth();
  const { mascotas, refugios } = usePets();
  const { solicitudes } = useApplications();

  const numeros = [
    { etiqueta: 'Usuarios', valor: usuarios.length },
    { etiqueta: 'Refugios', valor: refugios.length },
    {
      etiqueta: 'Disponibles',
      valor: mascotas.filter((m) => m.estado === ESTADOS_MASCOTA.DISPONIBLE)
        .length,
    },
    {
      etiqueta: 'Adoptadas',
      valor: mascotas.filter((m) => m.estado === ESTADOS_MASCOTA.ADOPTADA)
        .length,
    },
    {
      etiqueta: 'Solicitudes activas',
      valor: solicitudes.filter((s) =>
        [ESTADOS_SOLICITUD.PENDIENTE, ESTADOS_SOLICITUD.EN_EVALUACION].includes(
          s.estado,
        ),
      ).length,
    },
  ];

  return (
    <Container className="py-5">
      <h1 className="h2 mb-1">Administración</h1>
      <p className="text-body-secondary mb-4">
        Vista general de la plataforma.
      </p>

      <Row className="g-3 mb-5">
        {numeros.map((n) => (
          <Col xs={6} md={4} lg key={n.etiqueta}>
            <Card className="h-100 text-center">
              <Card.Body>
                <p className="display-6 fw-bold mb-0">{n.valor}</p>
                <p className="small text-body-secondary mb-0">{n.etiqueta}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        {SECCIONES.map((seccion) => (
          <Col md={6} key={seccion.titulo}>
            <Card as={Link} to={seccion.ruta} className="h-100 pc-card-enlace">
              <Card.Body className="d-flex gap-3 align-items-start">
                <span className="fs-2" aria-hidden="true">
                  {seccion.icono}
                </span>
                <div>
                  <Card.Title as="h2" className="h5 mb-1">
                    {seccion.titulo}
                  </Card.Title>
                  <Card.Text className="text-body-secondary small mb-0">
                    {seccion.texto}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
