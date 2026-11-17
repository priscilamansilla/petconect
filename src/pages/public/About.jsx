import { Card, Col, Container, Row } from 'react-bootstrap';

export default function About() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={9}>
          <h1 className="h2 mb-3">Sobre PETCONECT</h1>
          <p className="lead text-body-secondary">
            Una plataforma para que adoptar deje de depender de revisar diez
            cuentas de redes sociales distintas.
          </p>

          <p>
            Los refugios publican sus mascotas con toda la información que un
            adoptante necesita saber de entrada: especie, edad aproximada,
            tamaño, sexo, zona y en qué estado está la adopción. Quien busca
            adoptar filtra por esos mismos datos y manda la solicitud desde la
            misma pantalla, sin tener que escribir por privado y esperar.
          </p>

          <p>
            Cada solicitud queda registrada con su historial de cambios, así el
            refugio sabe en qué instancia está cada caso y el adoptante puede
            seguir el suyo.
          </p>

          <h2 className="h4 mt-5 mb-3">Adopción responsable</h2>
          <p>
            El puntaje de compatibilidad que muestra la plataforma es
            orientativo. Sirve para ordenar la búsqueda, no para decidir por
            nadie: la evaluación siempre la hace el refugio responsable del
            animal.
          </p>

          <Row className="g-4 mt-4">
            <Col md={4}>
              <Card className="h-100 text-center border-0 pc-seccion-clara">
                <Card.Body>
                  <p className="display-6 fw-bold mb-0">12</p>
                  <p className="text-body-secondary mb-0">
                    mascotas publicadas
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 text-center border-0 pc-seccion-clara">
                <Card.Body>
                  <p className="display-6 fw-bold mb-0">3</p>
                  <p className="text-body-secondary mb-0">
                    refugios asociados
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 text-center border-0 pc-seccion-clara">
                <Card.Body>
                  <p className="display-6 fw-bold mb-0">7</p>
                  <p className="text-body-secondary mb-0">
                    solicitudes registradas
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <p className="text-body-secondary small mt-4 mb-0">
            Trabajo práctico de Plataformas de Desarrollo — Escuela Da Vinci.
            Los datos que se ven son de ejemplo.
          </p>
        </Col>
      </Row>
    </Container>
  );
}
