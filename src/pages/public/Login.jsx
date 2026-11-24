import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { inicioSegunRol, useAuth } from '../../context/AuthContext';
import {
  email as validarEmail,
  requerido,
  validarFormulario,
} from '../../utils/validators';

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [datos, setDatos] = useState({ email: '', password: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  function cambiar(campo, valor) {
    setDatos((actual) => ({ ...actual, [campo]: valor }));
    setErrorGeneral('');
  }

  function enviar(evento) {
    evento.preventDefault();

    // Primero el formato (RN23), después las credenciales.
    const encontrados = validarFormulario({
      email: [() => validarEmail(datos.email)],
      password: [() => requerido(datos.password, 'La contraseña')],
    });
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    const resultado = iniciarSesion(datos.email, datos.password);

    if (!resultado.ok) {
      setErrorGeneral(resultado.error);
      return;
    }

    // Si llegó acá desde una pantalla protegida, vuelve a esa; si no, al
    // inicio que le corresponde según su rol.
    const destino =
      ubicacion.state?.desde ?? inicioSegunRol(resultado.usuario.rol);
    navegar(destino, { replace: true });
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

              {errorGeneral && (
                <Alert
                  variant="danger"
                  onClose={() => setErrorGeneral('')}
                  dismissible
                >
                  {errorGeneral}
                </Alert>
              )}

              <Form noValidate onSubmit={enviar}>
                <Form.Group className="mb-3" controlId="login-email">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    autoComplete="email"
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
                    autoComplete="current-password"
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

          

        </Col>
      </Row>
    </Container>
  );
}
