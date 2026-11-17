import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { refugios } from '../../data/shelters';
import { email as validarEmail, requerido, validarFormulario } from '../../utils/validators';

export default function Contact() {
  const [datos, setDatos] = useState({ nombre: '', email: '', mensaje: '' });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(campo, valor) {
    setDatos((actual) => ({ ...actual, [campo]: valor }));
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarFormulario({
      nombre: [() => requerido(datos.nombre, 'El nombre')],
      email: [() => validarEmail(datos.email)],
      mensaje: [() => requerido(datos.mensaje, 'El mensaje')],
    });
    setErrores(encontrados);
    if (Object.keys(encontrados).length === 0) setEnviado(true);
  }

  return (
    <Container className="py-5">
      <Row className="g-5">
        <Col lg={7}>
          <h1 className="h2 mb-3">Contacto</h1>
          <p className="text-body-secondary">
            Escribinos si sos un refugio y querés publicar tus mascotas, o si
            tenés una consulta sobre una adopción.
          </p>

          {enviado && (
            <Alert variant="success" onClose={() => setEnviado(false)} dismissible>
              Recibimos tu mensaje. (En la maqueta no se envía a ningún lado.)
            </Alert>
          )}

          <Form noValidate onSubmit={enviar}>
            <Form.Group className="mb-3" controlId="contacto-nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={datos.nombre}
                onChange={(e) => cambiar('nombre', e.target.value)}
                isInvalid={Boolean(errores.nombre)}
              />
              <Form.Control.Feedback type="invalid">
                {errores.nombre}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="contacto-email">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                value={datos.email}
                onChange={(e) => cambiar('email', e.target.value)}
                isInvalid={Boolean(errores.email)}
              />
              <Form.Control.Feedback type="invalid">
                {errores.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="contacto-mensaje">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={datos.mensaje}
                onChange={(e) => cambiar('mensaje', e.target.value)}
                isInvalid={Boolean(errores.mensaje)}
              />
              <Form.Control.Feedback type="invalid">
                {errores.mensaje}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary">
              Enviar mensaje
            </Button>
          </Form>
        </Col>

        <Col lg={5}>
          <h2 className="h5 mb-3">Refugios asociados</h2>
          {refugios.map((refugio) => (
            <Card className="mb-3" key={refugio.id}>
              <Card.Body>
                <Card.Title as="h3" className="h6 mb-1">
                  {refugio.nombre}
                </Card.Title>
                <p className="small text-body-secondary mb-0">
                  {refugio.ciudad}
                  <br />
                  {refugio.email}
                  <br />
                  {refugio.telefono}
                </p>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
}
