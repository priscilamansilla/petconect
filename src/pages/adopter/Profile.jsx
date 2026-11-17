import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import {
  CIUDADES,
  ESPECIES,
  RANGOS_EDAD,
  SEXOS,
  TAMANOS,
} from '../../data/options';

export default function Profile() {
  const { usuarioActual, actualizarPerfil } = useAuth();
  const [preferencias, setPreferencias] = useState(
    usuarioActual?.preferencias ?? {
      especie: '',
      tamano: '',
      rangoEdad: '',
      sexo: '',
      ciudad: '',
    },
  );
  const [guardado, setGuardado] = useState(false);

  function cambiar(campo, valor) {
    setPreferencias((actual) => ({ ...actual, [campo]: valor }));
    setGuardado(false);
  }

  function guardar(evento) {
    evento.preventDefault();
    actualizarPerfil({ preferencias });
    setGuardado(true);
  }

  return (
    <Container className="py-5">
      <h1 className="h2 mb-4">Mi perfil</h1>

      <Row className="g-4">
        <Col lg={5}>
          <Card>
            <Card.Body>
              <h2 className="h5 mb-3">Mis datos</h2>
              <dl className="row mb-0 small">
                <dt className="col-5">Nombre</dt>
                <dd className="col-7">
                  {usuarioActual.nombre} {usuarioActual.apellido}
                </dd>
                <dt className="col-5">Correo</dt>
                <dd className="col-7">{usuarioActual.email}</dd>
                <dt className="col-5">Ciudad</dt>
                <dd className="col-7">{usuarioActual.ciudad}</dd>
                <dt className="col-5">Rol</dt>
                <dd className="col-7 text-capitalize">{usuarioActual.rol}</dd>
                <dt className="col-5">Estado</dt>
                <dd className="col-7">
                  {usuarioActual.activo ? 'Activo' : 'Desactivado'}
                </dd>
              </dl>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card>
            <Card.Body>
              <h2 className="h5 mb-1">Preferencias de adopción</h2>
              <p className="small text-body-secondary">
                Con estos datos la plataforma calcula el puntaje de
                compatibilidad que ves en cada mascota. Dejá en blanco lo que
                te dé igual.
              </p>

              {guardado && (
                <Alert
                  variant="success"
                  onClose={() => setGuardado(false)}
                  dismissible
                >
                  Preferencias guardadas. Mirá cómo cambiaron los puntajes en
                  el listado de mascotas.
                </Alert>
              )}

              <Form onSubmit={guardar}>
                <Row className="g-3">
                  <Col sm={6}>
                    <Form.Group controlId="pref-especie">
                      <Form.Label>Especie</Form.Label>
                      <Form.Select
                        value={preferencias.especie}
                        onChange={(e) => cambiar('especie', e.target.value)}
                      >
                        <option value="">Me da igual</option>
                        {ESPECIES.map((e) => (
                          <option key={e} value={e}>
                            {e}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col sm={6}>
                    <Form.Group controlId="pref-tamano">
                      <Form.Label>Tamaño</Form.Label>
                      <Form.Select
                        value={preferencias.tamano}
                        onChange={(e) => cambiar('tamano', e.target.value)}
                      >
                        <option value="">Me da igual</option>
                        {TAMANOS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col sm={6}>
                    <Form.Group controlId="pref-edad">
                      <Form.Label>Edad</Form.Label>
                      <Form.Select
                        value={preferencias.rangoEdad}
                        onChange={(e) => cambiar('rangoEdad', e.target.value)}
                      >
                        <option value="">Me da igual</option>
                        {RANGOS_EDAD.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.etiqueta}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col sm={6}>
                    <Form.Group controlId="pref-sexo">
                      <Form.Label>Sexo</Form.Label>
                      <Form.Select
                        value={preferencias.sexo}
                        onChange={(e) => cambiar('sexo', e.target.value)}
                      >
                        <option value="">Me da igual</option>
                        {SEXOS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col sm={6}>
                    <Form.Group controlId="pref-ciudad">
                      <Form.Label>Zona</Form.Label>
                      <Form.Select
                        value={preferencias.ciudad}
                        onChange={(e) => cambiar('ciudad', e.target.value)}
                      >
                        <option value="">Me da igual</option>
                        {CIUDADES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Button type="submit" variant="primary">
                      Guardar preferencias
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
