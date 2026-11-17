import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import {
  CIUDADES,
  ESPECIES,
  ESTADOS_MASCOTA,
  RANGOS_EDAD,
  SEXOS,
  TAMANOS,
} from '../../data/options';

// Filtros de búsqueda (RN17). Todos se aplican en conjunto.
export default function PetFilters({ filtros, onCambiar, onLimpiar, resultados }) {
  function cambiar(campo, valor) {
    onCambiar({ ...filtros, [campo]: valor });
  }

  const hayFiltros = Object.values(filtros).some((v) => v);

  return (
    <Card className="pc-filtros mb-4">
      <Card.Body>
        <Row className="g-3 align-items-end">
          <Col xs={12} lg={3}>
            <Form.Label htmlFor="filtro-texto">Buscar</Form.Label>
            <Form.Control
              id="filtro-texto"
              type="search"
              placeholder="Nombre o descripción"
              value={filtros.texto}
              onChange={(e) => cambiar('texto', e.target.value)}
            />
          </Col>

          <Col xs={6} md={4} lg={2}>
            <Form.Label htmlFor="filtro-especie">Especie</Form.Label>
            <Form.Select
              id="filtro-especie"
              value={filtros.especie}
              onChange={(e) => cambiar('especie', e.target.value)}
            >
              <option value="">Todas</option>
              {ESPECIES.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={6} md={4} lg={2}>
            <Form.Label htmlFor="filtro-tamano">Tamaño</Form.Label>
            <Form.Select
              id="filtro-tamano"
              value={filtros.tamano}
              onChange={(e) => cambiar('tamano', e.target.value)}
            >
              <option value="">Cualquiera</option>
              {TAMANOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={6} md={4} lg={3}>
            <Form.Label htmlFor="filtro-edad">Edad</Form.Label>
            <Form.Select
              id="filtro-edad"
              value={filtros.rangoEdad}
              onChange={(e) => cambiar('rangoEdad', e.target.value)}
            >
              <option value="">Cualquiera</option>
              {RANGOS_EDAD.map((r) => (
                <option key={r.id} value={r.id}>{r.etiqueta}</option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={6} md={4} lg={2}>
            <Form.Label htmlFor="filtro-sexo">Sexo</Form.Label>
            <Form.Select
              id="filtro-sexo"
              value={filtros.sexo}
              onChange={(e) => cambiar('sexo', e.target.value)}
            >
              <option value="">Ambos</option>
              {SEXOS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={6} md={4} lg={3}>
            <Form.Label htmlFor="filtro-ciudad">Ubicación</Form.Label>
            <Form.Select
              id="filtro-ciudad"
              value={filtros.ciudad}
              onChange={(e) => cambiar('ciudad', e.target.value)}
            >
              <option value="">Todas</option>
              {CIUDADES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={12} md={4} lg={3}>
            <Form.Label htmlFor="filtro-estado">Disponibilidad</Form.Label>
            <Form.Select
              id="filtro-estado"
              value={filtros.estado}
              onChange={(e) => cambiar('estado', e.target.value)}
            >
              <option value="">Todas</option>
              <option value={ESTADOS_MASCOTA.DISPONIBLE}>
                {ESTADOS_MASCOTA.DISPONIBLE}
              </option>
              <option value={ESTADOS_MASCOTA.EN_PROCESO}>
                {ESTADOS_MASCOTA.EN_PROCESO}
              </option>
              <option value={ESTADOS_MASCOTA.ADOPTADA}>
                {ESTADOS_MASCOTA.ADOPTADA}
              </option>
            </Form.Select>
          </Col>

          <Col xs={12} lg={6} className="d-flex justify-content-between align-items-center">
            <span className="text-body-secondary small">
              {resultados} {resultados === 1 ? 'mascota encontrada' : 'mascotas encontradas'}
            </span>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={onLimpiar}
              disabled={!hayFiltros}
            >
              Limpiar filtros
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
