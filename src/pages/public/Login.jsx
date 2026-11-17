import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  email as validarEmail,
  requerido,
  validarFormulario,
} from '../../utils/validators';

export default function Login() {
  const [datos, setDatos] = useState({ email: '', password: '' });
  const [errores, setErrores] = useState({});
  const [intento, setIntento] = useState(false);

  function cambiar(campo, valor) {
    setDatos((actual) => ({ ...actual, [campo]: valor }));
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarFormulario({
      email: [() => validarEmail(datos.email)],
      password: [() => requerido(datos.password, 'La contraseña')],
    });
    setErrores(encontrados);
    if (Object.keys(encontrados).length === 0) setIntento(true);
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={7} lg={5}>
          <Card>
            <Card.Body className="p-4">
              <h1 className="h3 mb-1">Iniciar sesión</h1>
              <p className="text-body-secondary small mb-4">
                Entrá para guardar favoritos y seguir tus solicitudes.
              </p>

              {intento && (
                <Alert variant="info">
                  Los datos son válidos. La autenticación todavía no está
                  implementada: corresponde al bloque de login y roles.
                </Alert>
              )}

              <Form noValidate onSubmit={enviar}>
                <Form.Group className="mb-3" controlId="login-email">
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

                <Form.Group className="mb-4" controlId="login-password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={datos.password}
                    onChange={(e) => cambiar('password', e.target.value)}
                    isInvalid={Boolean(errores.password)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  Entrar
                </Button>
              </Form>

              <p className="text-center small mt-4 mb-0">
                ¿Todavía no tenés cuenta?{' '}
                <Link to="/registrarme">Registrate</Link>
              </p>
            </Card.Body>
          </Card>

          <Card className="mt-3 border-0 pc-seccion-clara">
            <Card.Body className="small">
              <p className="fw-semibold mb-1">Usuarios de prueba</p>
              <p className="mb-0 text-body-secondary">
                sofia.ramirez@gmail.com (adoptante) ·
                contacto@patitasdeloeste.org (refugio) · admin@petconect.com
                (administradora). La contraseña de todos es 1234.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
