import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CIUDADES } from '../../data/options';
import { usuarios } from '../../data/users';
import {
  email as validarEmail,
  longitudMinima,
  requerido,
  validarFormulario,
} from '../../utils/validators';

const VACIO = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  ciudad: '',
};

export default function Register() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [listo, setListo] = useState(false);

  function cambiar(campo, valor) {
    setDatos((actual) => ({ ...actual, [campo]: valor }));
  }

  function enviar(evento) {
    evento.preventDefault();

    const encontrados = validarFormulario({
      nombre: [() => requerido(datos.nombre, 'El nombre')],
      apellido: [() => requerido(datos.apellido, 'El apellido')],
      email: [
        () => validarEmail(datos.email),
        // RN01: el correo electrónico tiene que ser único.
        () =>
          usuarios.some(
            (u) => u.email.toLowerCase() === datos.email.trim().toLowerCase(),
          )
            ? 'Ya existe una cuenta con ese correo.'
            : null,
      ],
      password: [
        () => requerido(datos.password, 'La contraseña'),
        () => longitudMinima(datos.password, 4, 'La contraseña'),
      ],
      ciudad: [() => requerido(datos.ciudad, 'La ciudad')],
    });

    setErrores(encontrados);
    if (Object.keys(encontrados).length === 0) setListo(true);
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={9} lg={7}>
          <Card>
            <Card.Body className="p-4">
              <h1 className="h3 mb-1">Crear una cuenta</h1>
              <p className="text-body-secondary small mb-4">
                Todos los campos son obligatorios.
              </p>

              {listo && (
                <Alert variant="info">
                  Los datos son válidos. El alta todavía no está implementada:
                  corresponde al bloque de login y roles.
                </Alert>
              )}

              <Form noValidate onSubmit={enviar}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="registro-nombre">
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
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="registro-apellido">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        value={datos.apellido}
                        onChange={(e) => cambiar('apellido', e.target.value)}
                        isInvalid={Boolean(errores.apellido)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.apellido}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="registro-email">
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
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="registro-ciudad">
                      <Form.Label>Ciudad</Form.Label>
                      <Form.Select
                        value={datos.ciudad}
                        onChange={(e) => cambiar('ciudad', e.target.value)}
                        isInvalid={Boolean(errores.ciudad)}
                      >
                        <option value="">Elegir...</option>
                        {CIUDADES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errores.ciudad}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="registro-password">
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
                  </Col>

                  <Col xs={12}>
                    <Button type="submit" variant="primary" className="w-100">
                      Crear cuenta
                    </Button>
                  </Col>
                </Row>
              </Form>

              <p className="text-center small mt-4 mb-0">
                ¿Ya tenés cuenta? <Link to="/ingresar">Iniciá sesión</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
