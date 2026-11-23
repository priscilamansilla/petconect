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
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../data/options";
import { refugios } from "../../data/shelters";

const FILTROS_INICIALES = { busqueda: "", rol: "", estado: "" };
const FORMULARIO_INICIAL = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  ciudad: "",
  rol: ROLES.ADOPTANTE,
  refugioId: "",
  activo: true,
};
const ROLES_DISPONIBLES = [
  { valor: ROLES.ADOPTANTE, etiqueta: "Adoptante", color: "primary" },
  { valor: ROLES.REFUGIO, etiqueta: "Refugio", color: "info" },
  { valor: ROLES.ADMIN, etiqueta: "Administrador", color: "dark" },
];

function etiquetaRol(rol) {
  return ROLES_DISPONIBLES.find((item) => item.valor === rol)?.etiqueta ?? rol;
}

function colorRol(rol) {
  return (
    ROLES_DISPONIBLES.find((item) => item.valor === rol)?.color ?? "secondary"
  );
}

export default function AdminUsers() {
  const {
    usuarios,
    usuarioActual,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarEstadoUsuario,
  } = useAuth();
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditado, setUsuarioEditado] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const usuariosFiltrados = useMemo(() => {
    const busqueda = filtros.busqueda.trim().toLocaleLowerCase();
    return usuarios.filter((usuario) => {
      const texto =
        `${usuario.nombre} ${usuario.apellido} ${usuario.email}`.toLocaleLowerCase();
      const coincideBusqueda = !busqueda || texto.includes(busqueda);
      const coincideRol = !filtros.rol || usuario.rol === filtros.rol;
      const coincideEstado =
        !filtros.estado || String(Boolean(usuario.activo)) === filtros.estado;
      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }, [usuarios, filtros]);

  function abrirAlta() {
    setUsuarioEditado(null);
    setFormulario(FORMULARIO_INICIAL);
    setErrores({});
    setMensaje(null);
    setModalAbierto(true);
  }

  function abrirEdicion(usuario) {
    setUsuarioEditado(usuario);
    setFormulario({
      nombre: usuario.nombre ?? "",
      apellido: usuario.apellido ?? "",
      email: usuario.email ?? "",
      password: "",
      ciudad: usuario.ciudad ?? "",
      rol: usuario.rol,
      refugioId: usuario.refugioId ?? "",
      activo: Boolean(usuario.activo),
    });
    setErrores({});
    setMensaje(null);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setErrores({});
  }

  function cambiarCampo(evento) {
    const { name, value, type, checked } = evento.target;
    setFormulario((actual) => ({
      ...actual,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrores((actuales) => ({ ...actuales, [name]: "" }));
  }

  function validar() {
    const nuevosErrores = {};
    ["nombre", "apellido", "email", "ciudad"].forEach((campo) => {
      if (!formulario[campo].trim())
        nuevosErrores[campo] = "Este campo es obligatorio.";
    });
    if (
      formulario.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formulario.email.trim())
    ) {
      nuevosErrores.email = "Escribí un correo electrónico válido.";
    }
    const correoNormalizado = formulario.email.trim().toLowerCase();
    if (
      usuarios.some(
        (usuario) =>
          usuario.id !== usuarioEditado?.id &&
          usuario.email.trim().toLowerCase() === correoNormalizado,
      )
    ) {
      nuevosErrores.email = "Ya existe una cuenta con ese correo.";
    }
    if (!Object.values(ROLES).includes(formulario.rol)) {
      nuevosErrores.rol = "Seleccioná un rol válido.";
    }
    if (formulario.rol === ROLES.REFUGIO && !formulario.refugioId) {
      nuevosErrores.refugioId = "Seleccioná el refugio asociado.";
    }
    if (!usuarioEditado && !formulario.password.trim()) {
      nuevosErrores.password =
        "La contraseña es obligatoria para crear una cuenta.";
    } else if (formulario.password && formulario.password.trim().length < 4) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 4 caracteres.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function guardar(evento) {
    evento.preventDefault();
    if (!validar()) return;

    const resultado = usuarioEditado
      ? actualizarUsuario(usuarioEditado.id, formulario)
      : crearUsuario(formulario);
    if (!resultado.ok) {
      setMensaje({ tipo: "danger", texto: resultado.error });
      return;
    }

    cerrarModal();
    setMensaje({
      tipo: "success",
      texto: usuarioEditado
        ? "Los datos del usuario se actualizaron."
        : "El usuario se creó correctamente.",
    });
  }

  function alternarEstado(usuario) {
    const resultado = cambiarEstadoUsuario(usuario.id, !usuario.activo);
    if (!resultado.ok) {
      setMensaje({ tipo: "danger", texto: resultado.error });
      return;
    }
    setMensaje({
      tipo: "success",
      texto: `La cuenta de ${usuario.nombre} quedó ${usuario.activo ? "desactivada" : "activa"}.`,
    });
  }

  function confirmarEliminacion(usuario) {
    if (
      !window.confirm(
        `¿Eliminar a ${usuario.nombre} ${usuario.apellido}? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    const resultado = eliminarUsuario(usuario.id);
    setMensaje(
      resultado.ok
        ? { tipo: "success", texto: "El usuario se eliminó correctamente." }
        : { tipo: "danger", texto: resultado.error },
    );
  }

  function limpiarFiltros() {
    setFiltros(FILTROS_INICIALES);
  }

  return (
    <Container className="py-5">
      <Link to="/admin" className="small">
        ← Volver a administración
      </Link>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-2 mb-4">
        <div>
          <h1 className="h2 mb-1">Usuarios</h1>
          <p className="text-body-secondary mb-0">
            Gestioná las cuentas y sus roles desde este panel (RN03).
          </p>
        </div>
        <Button variant="primary" onClick={abrirAlta}>
          Crear usuario
        </Button>
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
            <Col xs={12} md={6}>
              <Form.Group controlId="buscar-usuarios">
                <Form.Label>Buscar usuarios</Form.Label>
                <Form.Control
                  type="search"
                  value={filtros.busqueda}
                  onChange={(evento) =>
                    setFiltros((actual) => ({
                      ...actual,
                      busqueda: evento.target.value,
                    }))
                  }
                  placeholder="Nombre, apellido o correo"
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group controlId="filtrar-rol">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  value={filtros.rol}
                  onChange={(evento) =>
                    setFiltros((actual) => ({
                      ...actual,
                      rol: evento.target.value,
                    }))
                  }
                >
                  <option value="">Todos</option>
                  {ROLES_DISPONIBLES.map((rol) => (
                    <option key={rol.valor} value={rol.valor}>
                      {rol.etiqueta}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group controlId="filtrar-estado">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={filtros.estado}
                  onChange={(evento) =>
                    setFiltros((actual) => ({
                      ...actual,
                      estado: evento.target.value,
                    }))
                  }
                >
                  <option value="">Todos</option>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={2}>
              <Button
                className="w-100"
                variant="outline-secondary"
                onClick={limpiarFiltros}
                disabled={!filtros.busqueda && !filtros.rol && !filtros.estado}
              >
                Limpiar filtros
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="p-0">
          {usuarios.length === 0 ? (
            <div className="p-4 text-center text-body-secondary">
              Todavía no hay usuarios registrados.
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="p-4 text-center text-body-secondary">
              No hay usuarios que coincidan con la búsqueda y los filtros.
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Apellido</th>
                  <th scope="col">Correo electrónico</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="text-end">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => {
                  const esUsuarioActual = usuario.id === usuarioActual?.id;
                  return (
                    <tr key={usuario.id}>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.apellido}</td>
                      <td className="small">{usuario.email}</td>
                      <td>
                        <Badge
                          bg={colorRol(usuario.rol)}
                          text={
                            usuario.rol === ROLES.REFUGIO ? "dark" : undefined
                          }
                        >
                          {etiquetaRol(usuario.rol)}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={usuario.activo ? "success" : "secondary"}>
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => abrirEdicion(usuario)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              usuario.activo
                                ? "outline-warning"
                                : "outline-success"
                            }
                            disabled={esUsuarioActual}
                            onClick={() => alternarEstado(usuario)}
                          >
                            {usuario.activo ? "Desactivar" : "Activar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            disabled={esUsuarioActual}
                            onClick={() => confirmarEliminacion(usuario)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <p className="small text-body-secondary mt-3">
        Una cuenta inactiva no puede iniciar sesión. Los roles disponibles son
        adoptante, refugio y administrador.
      </p>

      <Modal show={modalAbierto} onHide={cerrarModal} centered>
        <Form noValidate onSubmit={guardar}>
          <Modal.Header closeButton>
            <Modal.Title>
              {usuarioEditado ? "Editar usuario" : "Crear usuario"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {mensaje?.tipo === "danger" && (
              <Alert variant="danger">{mensaje.texto}</Alert>
            )}
            <Row className="g-3">
              <Col sm={6}>
                <Form.Group controlId="usuario-nombre">
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
                <Form.Group controlId="usuario-apellido">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    name="apellido"
                    value={formulario.apellido}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.apellido)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.apellido}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="usuario-email">
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
              {!usuarioEditado && (
                <Col xs={12}>
                  <Form.Group controlId="usuario-password">
                    <Form.Label>Contraseña inicial</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formulario.password}
                      onChange={cambiarCampo}
                      isInvalid={Boolean(errores.password)}
                      autoComplete="new-password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errores.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
              <Col xs={12}>
                <Form.Group controlId="usuario-ciudad">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    name="ciudad"
                    value={formulario.ciudad}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.ciudad)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.ciudad}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="usuario-rol">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select
                    name="rol"
                    value={formulario.rol}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.rol)}
                    disabled={usuarioEditado?.id === usuarioActual?.id}
                  >
                    {ROLES_DISPONIBLES.map((rol) => (
                      <option key={rol.valor} value={rol.valor}>
                        {rol.etiqueta}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errores.rol}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              {formulario.rol === ROLES.REFUGIO && (
                <Col xs={12}>
                  <Form.Group controlId="usuario-refugio">
                    <Form.Label>Refugio asociado</Form.Label>
                    <Form.Select
                      name="refugioId"
                      value={formulario.refugioId}
                      onChange={cambiarCampo}
                      isInvalid={Boolean(errores.refugioId)}
                    >
                      <option value="">Seleccionar refugio</option>
                      {refugios.map((refugio) => (
                        <option key={refugio.id} value={refugio.id}>
                          {refugio.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errores.refugioId}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
              <Col xs={12}>
                <Form.Check
                  id="usuario-activo"
                  name="activo"
                  label="Cuenta activa"
                  checked={formulario.activo}
                  onChange={cambiarCampo}
                  disabled={usuarioEditado?.id === usuarioActual?.id}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
