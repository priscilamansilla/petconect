import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { EstadoMascota } from "../../components/common/EstadoBadge";
import { useAuth } from "../../context/AuthContext";
import { useApplications } from "../../context/ApplicationContext";
import { usePets } from "../../context/PetContext";
import {
  CIUDADES,
  ESTADOS_MASCOTA,
  ESTADOS_SOLICITUD,
  ROLES,
} from "../../data/options";

const FILTROS_INICIALES = { texto: "", estado: "" };
const FORMULARIO_INICIAL = {
  nombre: "",
  responsable: "",
  email: "",
  telefono: "",
  ciudad: "",
  descripcion: "",
};

// RN21 y RN23: supervisión y gestión administrativa de refugios con validación de sus datos.
export default function AdminShelters() {
  const {
    refugios,
    mascotas,
    crearRefugioAdmin,
    actualizarRefugioAdmin,
    cambiarEstadoRefugioAdmin,
  } = usePets();
  const { usuarios } = useAuth();
  const { solicitudes } = useApplications();
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [refugioEditado, setRefugioEditado] = useState(null);
  const [refugioDetalle, setRefugioDetalle] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const refugiosVisibles = useMemo(() => {
    const texto = filtros.texto.trim().toLocaleLowerCase();
    return refugios.filter((refugio) => {
      const coincideTexto =
        !texto ||
        `${refugio.nombre} ${refugio.ciudad}`
          .toLocaleLowerCase()
          .includes(texto);
      const coincideEstado =
        !filtros.estado || String(Boolean(refugio.activo)) === filtros.estado;
      return coincideTexto && coincideEstado;
    });
  }, [refugios, filtros]);

  function responsableDe(refugio) {
    if (refugio.responsable) return refugio.responsable;
    const cuenta = usuarios.find(
      (usuario) =>
        usuario.rol === ROLES.REFUGIO && usuario.refugioId === refugio.id,
    );
    return cuenta
      ? `${cuenta.nombre} ${cuenta.apellido}`
      : "Sin responsable asignado";
  }

  function abrirAlta() {
    setRefugioEditado(null);
    setFormulario(FORMULARIO_INICIAL);
    setErrores({});
    setMensaje(null);
    setModalAbierto(true);
  }

  function abrirEdicion(refugio) {
    setRefugioEditado(refugio);
    setFormulario({
      nombre: refugio.nombre ?? "",
      responsable: responsableDe(refugio),
      email: refugio.email ?? "",
      telefono: refugio.telefono ?? "",
      ciudad: refugio.ciudad ?? "",
      descripcion: refugio.descripcion ?? "",
    });
    setErrores({});
    setMensaje(null);
    setModalAbierto(true);
  }

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
    setErrores((actuales) => ({ ...actuales, [name]: "" }));
  }

  // RN21 y RN23: valida campos, correo, ubicación y duplicados antes de guardar un refugio.
  function validar() {
    const nuevos = {};
    [
      "nombre",
      "responsable",
      "email",
      "telefono",
      "ciudad",
      "descripcion",
    ].forEach((campo) => {
      if (!formulario[campo].trim())
        nuevos[campo] = "Este campo es obligatorio.";
    });
    if (
      formulario.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formulario.email.trim())
    ) {
      nuevos.email = "Escribí un correo electrónico válido.";
    }
    if (!CIUDADES.includes(formulario.ciudad))
      nuevos.ciudad = "Seleccioná una ubicación válida.";
    if (
      refugios.some(
        (refugio) =>
          refugio.id !== refugioEditado?.id &&
          refugio.email.toLowerCase() === formulario.email.trim().toLowerCase(),
      )
    ) {
      nuevos.email = "Ya existe un refugio con ese correo.";
    }
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  // RN21 y RN23: registra o actualiza refugios usando la persistencia local compartida.
  function guardar(evento) {
    evento.preventDefault();
    if (!validar()) return;
    const resultado = refugioEditado
      ? actualizarRefugioAdmin(refugioEditado.id, formulario)
      : crearRefugioAdmin(formulario);
    if (!resultado.ok) {
      setMensaje({ tipo: "danger", texto: resultado.error });
      return;
    }
    setModalAbierto(false);
    setMensaje({
      tipo: "success",
      texto: refugioEditado
        ? "Los datos del refugio se actualizaron."
        : "El refugio se registró correctamente.",
    });
  }

  // RN21 y RN24: conserva mascotas e historiales y bloquea la baja si quedan registros activos.
  function cambiarEstado(refugio) {
    const activar = !refugio.activo;
    if (!activar) {
      const mascotasActivas = mascotas.filter(
        (mascota) =>
          mascota.refugioId === refugio.id &&
          [ESTADOS_MASCOTA.DISPONIBLE, ESTADOS_MASCOTA.EN_PROCESO].includes(
            mascota.estado,
          ),
      );
      const idsMascotas = new Set(
        mascotas
          .filter((mascota) => mascota.refugioId === refugio.id)
          .map((mascota) => mascota.id),
      );
      const solicitudesActivas = solicitudes.filter(
        (solicitud) =>
          idsMascotas.has(solicitud.mascotaId) &&
          [
            ESTADOS_SOLICITUD.PENDIENTE,
            ESTADOS_SOLICITUD.EN_EVALUACION,
          ].includes(solicitud.estado),
      );
      if (mascotasActivas.length || solicitudesActivas.length) {
        setMensaje({
          tipo: "warning",
          texto: `No se puede desactivar todavía: hay ${mascotasActivas.length} mascota(s) activa(s) y ${solicitudesActivas.length} solicitud(es) sin resolver. Conservá y resolvé esos registros primero.`,
        });
        return;
      }
    }
    const accion = activar ? "activar" : "desactivar";
    if (
      !window.confirm(
        `¿Querés ${accion} el refugio ${refugio.nombre}? Sus registros históricos se conservarán.`,
      )
    )
      return;
    const resultado = cambiarEstadoRefugioAdmin(refugio.id, activar);
    setMensaje(
      resultado.ok
        ? {
            tipo: "success",
            texto: `El refugio quedó ${activar ? "activo" : "inactivo"}.`,
          }
        : { tipo: "danger", texto: resultado.error },
    );
  }

  function limpiarFiltros() {
    setFiltros(FILTROS_INICIALES);
  }

  const mascotasDelDetalle = refugioDetalle
    ? mascotas.filter((mascota) => mascota.refugioId === refugioDetalle.id)
    : [];

  return (
    <Container className="py-5">
      <Link to="/admin" className="small">
        ← Volver a administración
      </Link>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-2 mb-4">
        <div>
          <h1 className="h2 mb-1">Refugios</h1>
          <p className="text-body-secondary mb-0">
            Supervisá su información y publicaciones relacionadas.
          </p>
        </div>
        <Button onClick={abrirAlta}>Registrar refugio</Button>
      </div>
      {mensaje && (
        <Alert
          variant={mensaje.tipo}
          dismissible
          onClose={() => setMensaje(null)}
        >
          {mensaje.texto}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col xs={12} md={8}>
              <Form.Group controlId="buscar-refugio">
                <Form.Label>Buscar por nombre o ubicación</Form.Label>
                <Form.Control
                  type="search"
                  value={filtros.texto}
                  onChange={(e) =>
                    setFiltros((v) => ({ ...v, texto: e.target.value }))
                  }
                  placeholder="Nombre o ciudad"
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group controlId="filtrar-estado-refugio">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={filtros.estado}
                  onChange={(e) =>
                    setFiltros((v) => ({ ...v, estado: e.target.value }))
                  }
                >
                  <option value="">Todos</option>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Button
                className="w-100"
                variant="outline-secondary"
                onClick={limpiarFiltros}
                disabled={!filtros.texto && !filtros.estado}
              >
                Limpiar filtros
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        {refugios.length === 0 ? (
          <div className="p-4 text-center text-body-secondary">
            Todavía no hay refugios registrados.
          </div>
        ) : refugiosVisibles.length === 0 ? (
          <div className="p-4 text-center text-body-secondary">
            No hay refugios que coincidan con los filtros.
          </div>
        ) : (
          <Table responsive hover className="mb-0 align-middle">
            <thead>
              <tr>
                <th scope="col">Refugio</th>
                <th scope="col">Responsable</th>
                <th scope="col">Contacto</th>
                <th scope="col">Ubicación</th>
                <th scope="col">Mascotas</th>
                <th scope="col">Estado</th>
                <th scope="col" className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {refugiosVisibles.map((refugio) => {
                const suyas = mascotas.filter(
                  (mascota) => mascota.refugioId === refugio.id,
                );
                return (
                  <tr key={refugio.id}>
                    <td className="fw-semibold">{refugio.nombre}</td>
                    <td>{responsableDe(refugio)}</td>
                    <td className="small">
                      {refugio.email}
                      <br />
                      {refugio.telefono}
                    </td>
                    <td>{refugio.ciudad}</td>
                    <td>{suyas.length}</td>
                    <td>
                      <Badge bg={refugio.activo ? "success" : "secondary"}>
                        {refugio.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => setRefugioDetalle(refugio)}
                        >
                          Ver mascotas
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => abrirEdicion(refugio)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            refugio.activo
                              ? "outline-warning"
                              : "outline-success"
                          }
                          onClick={() => cambiarEstado(refugio)}
                        >
                          {refugio.activo ? "Desactivar" : "Activar"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal show={modalAbierto} onHide={() => setModalAbierto(false)} centered>
        <Form noValidate onSubmit={guardar}>
          <Modal.Header closeButton>
            <Modal.Title>
              {refugioEditado ? "Editar refugio" : "Registrar refugio"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {mensaje?.tipo === "danger" && (
              <Alert variant="danger">{mensaje.texto}</Alert>
            )}
            <Row className="g-3">
              <Col sm={6}>
                <Form.Group controlId="refugio-nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    name="nombre"
                    value={formulario.nombre}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.nombre)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="refugio-responsable">
                  <Form.Label>Responsable</Form.Label>
                  <Form.Control
                    name="responsable"
                    value={formulario.responsable}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.responsable)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.responsable}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="refugio-email">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formulario.email}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.email)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="refugio-telefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    name="telefono"
                    value={formulario.telefono}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.telefono)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.telefono}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="refugio-ciudad">
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Select
                    name="ciudad"
                    value={formulario.ciudad}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.ciudad)}
                  >
                    <option value="">Seleccionar ciudad</option>
                    {CIUDADES.map((ciudad) => (
                      <option key={ciudad}>{ciudad}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errores.ciudad}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="refugio-descripcion">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.descripcion)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.descripcion}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => setModalAbierto(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={Boolean(refugioDetalle)}
        onHide={() => setRefugioDetalle(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{refugioDetalle?.nombre} · Mascotas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mascotasDelDetalle.length === 0 ? (
            <p className="text-body-secondary mb-0">
              Este refugio todavía no tiene mascotas asociadas.
            </p>
          ) : (
            <ul className="list-group list-group-flush">
              {mascotasDelDetalle.map((mascota) => (
                <li
                  key={mascota.id}
                  className="list-group-item d-flex justify-content-between gap-3"
                >
                  <span>
                    {mascota.nombre}{" "}
                    <span className="text-body-secondary">
                      ({mascota.especie})
                    </span>
                  </span>
                  <EstadoMascota estado={mascota.estado} />
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
