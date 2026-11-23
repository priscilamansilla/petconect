import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { restablecerDatos } from '../../hooks/useEstadoGuardado';

export default function Footer() {
  return (
    <footer className="pc-footer mt-5">
      <Container className="py-4">
        <Row className="gy-3">
          <Col md={5}>
            <p className="fw-bold mb-2">
              <span aria-hidden="true">🐾</span> PETCONECT
            </p>
            <p className="small mb-0 text-body-secondary">
              Plataforma de gestión y adopción responsable de mascotas. Conecta
              adoptantes con refugios de la zona.
            </p>
          </Col>
          <Col md={3}>
            <p className="fw-semibold mb-2">Secciones</p>
            <ul className="list-unstyled small mb-0">
              <li>
                <Link to="/mascotas">Mascotas en adopción</Link>
              </li>
              <li>
                <Link to="/nosotros">Nosotros</Link>
              </li>
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <p className="fw-semibold mb-2">Trabajo práctico</p>
            <p className="small text-body-secondary mb-1">
              Plataformas de Desarrollo — Escuela Da Vinci.
              <br />
              Los datos son de ejemplo y se guardan en este navegador.
            </p>
            {/* Por si al probar la aplicación se desordenan los datos: vuelve
                todo al estado inicial. */}
            <button
              type="button"
              className="btn btn-link btn-sm p-0 small"
              onClick={restablecerDatos}
            >
              Restablecer datos de ejemplo
            </button>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
