import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../context/PetContext';
import { CIUDADES } from '../../data/options';

export default function ShelterProfile() {
  const { usuarioActual } = useAuth();
  const { obtenerRefugio } = usePets();
  const refugio = obtenerRefugio(usuarioActual.refugioId);

  return (
    <Container className="py-5">
      <h1 className="h2 mb-4">Datos del refugio</h1>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Body>
              <Form>
                <Row className="g-3">
                  <Col md={8}>
                    <Form.Group controlId="refugio-nombre">
                      <Form.Label>Nombre del refugio</Form.Label>
                      <Form.Control defaultValue={refugio?.nombre} />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group controlId="refugio-ciudad">
                      <Form.Label>Ciudad</Form.Label>
                      <Form.Select defaultValue={refugio?.ciudad}>
                        {CIUDADES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="refugio-email">
                      <Form.Label>Correo de contacto</Form.Label>
                      <Form.Control type="email" defaultValue={refugio?.email} />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="refugio-telefono">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control defaultValue={refugio?.telefono} />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="refugio-descripcion">
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        defaultValue={refugio?.descripcion}
                      />
                      <Form.Text>
                        Es lo que ven los adoptantes en la página de cada
                        mascota.
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="text-end">
                    <Button variant="primary" disabled>
                      Guardar cambios
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
