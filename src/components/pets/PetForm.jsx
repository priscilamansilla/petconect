import { useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import {
  CIUDADES,
  ESPECIES,
  ESTADOS_MASCOTA,
  SEXOS,
  TAMANOS,
} from '../../data/options';
import {
  requerido,
  numeroEntre,
  validarFormulario,
} from '../../utils/validators';

const VACIO = {
  nombre: '',
  especie: '',
  edad: '',
  sexo: '',
  tamano: '',
  descripcion: '',
  ciudad: '',
  estado: ESTADOS_MASCOTA.DISPONIBLE,
  vacunado: false,
  castrado: false,
  aptoNinos: false,
  aptoDepartamento: false,
};

// Alta y edición de una publicación (RN05). Los campos marcados con asterisco
// son obligatorios y se validan antes de guardar (RN23).
export default function PetForm({ mascota, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(mascota ? { ...mascota } : VACIO);
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(false);

  function cambiar(campo, valor) {
    setDatos((actual) => ({ ...actual, [campo]: valor }));
  }

  function enviar(evento) {
    evento.preventDefault();
    const encontrados = validarFormulario({
      nombre: [() => requerido(datos.nombre, 'El nombre')],
      especie: [() => requerido(datos.especie, 'La especie')],
      edad: [
        () => requerido(datos.edad, 'La edad'),
        () => numeroEntre(datos.edad, 0, 30, 'La edad'),
      ],
      sexo: [() => requerido(datos.sexo, 'El sexo')],
      tamano: [() => requerido(datos.tamano, 'El tamaño')],
      descripcion: [() => requerido(datos.descripcion, 'La descripción')],
      ciudad: [() => requerido(datos.ciudad, 'La ubicación')],
    });

    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setAviso(true);
    onGuardar?.(datos);
  }

  return (
    <Form noValidate onSubmit={enviar}>
      {aviso && (
        <Alert variant="info" onClose={() => setAviso(false)} dismissible>
          Los datos son válidos. El guardado todavía no está implementado:
          corresponde al bloque de refugio y solicitudes.
        </Alert>
      )}

      <Row className="g-3">
        <Col md={6}>
          <Form.Group controlId="mascota-nombre">
            <Form.Label>Nombre *</Form.Label>
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

        <Col md={3}>
          <Form.Group controlId="mascota-especie">
            <Form.Label>Especie *</Form.Label>
            <Form.Select
              value={datos.especie}
              onChange={(e) => cambiar('especie', e.target.value)}
              isInvalid={Boolean(errores.especie)}
            >
              <option value="">Elegir...</option>
              {ESPECIES.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errores.especie}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group controlId="mascota-edad">
            <Form.Label>Edad aproximada *</Form.Label>
            <Form.Control
              type="number"
              min={0}
              max={30}
              value={datos.edad}
              onChange={(e) => cambiar('edad', e.target.value)}
              isInvalid={Boolean(errores.edad)}
            />
            <Form.Text>En años. Poner 0 si tiene menos de uno.</Form.Text>
            <Form.Control.Feedback type="invalid">
              {errores.edad}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId="mascota-sexo">
            <Form.Label>Sexo *</Form.Label>
            <Form.Select
              value={datos.sexo}
              onChange={(e) => cambiar('sexo', e.target.value)}
              isInvalid={Boolean(errores.sexo)}
            >
              <option value="">Elegir...</option>
              {SEXOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errores.sexo}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId="mascota-tamano">
            <Form.Label>Tamaño *</Form.Label>
            <Form.Select
              value={datos.tamano}
              onChange={(e) => cambiar('tamano', e.target.value)}
              isInvalid={Boolean(errores.tamano)}
            >
              <option value="">Elegir...</option>
              {TAMANOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errores.tamano}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId="mascota-ciudad">
            <Form.Label>Ubicación *</Form.Label>
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

        <Col xs={12}>
          <Form.Group controlId="mascota-descripcion">
            <Form.Label>Descripción *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={datos.descripcion}
              onChange={(e) => cambiar('descripcion', e.target.value)}
              isInvalid={Boolean(errores.descripcion)}
            />
            <Form.Control.Feedback type="invalid">
              {errores.descripcion}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="mascota-estado">
            <Form.Label>Estado *</Form.Label>
            <Form.Select
              value={datos.estado}
              onChange={(e) => cambiar('estado', e.target.value)}
            >
              {Object.values(ESTADOS_MASCOTA).map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </Form.Select>
            <Form.Text>
              Solo las mascotas disponibles reciben solicitudes nuevas (RN07).
            </Form.Text>
          </Form.Group>
        </Col>

        <Col md={6}>
          <fieldset>
            <legend className="form-label fs-6">Características</legend>
            <div className="d-flex flex-wrap gap-3">
              <Form.Check
                id="mascota-vacunado"
                label="Vacunado"
                checked={datos.vacunado}
                onChange={(e) => cambiar('vacunado', e.target.checked)}
              />
              <Form.Check
                id="mascota-castrado"
                label="Castrado"
                checked={datos.castrado}
                onChange={(e) => cambiar('castrado', e.target.checked)}
              />
              <Form.Check
                id="mascota-ninos"
                label="Apto para chicos"
                checked={datos.aptoNinos}
                onChange={(e) => cambiar('aptoNinos', e.target.checked)}
              />
              <Form.Check
                id="mascota-depto"
                label="Apto departamento"
                checked={datos.aptoDepartamento}
                onChange={(e) => cambiar('aptoDepartamento', e.target.checked)}
              />
            </div>
          </fieldset>
        </Col>

        <Col xs={12} className="d-flex gap-2 justify-content-end">
          {onCancelar && (
            <Button variant="outline-secondary" onClick={onCancelar}>
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="primary">
            {mascota ? 'Guardar cambios' : 'Publicar mascota'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
