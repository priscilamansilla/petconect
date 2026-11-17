import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
            <p className="small text-body-secondary mb-0">
              Plataformas de Desarrollo — Escuela Da Vinci.
              <br />
              Maqueta navegable con datos de ejemplo.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
