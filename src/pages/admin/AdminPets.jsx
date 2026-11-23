import { useMemo, useState } from "react";
import {
  Alert,
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
import { edadEnTexto } from "../../utils/format";
import { useApplications } from "../../context/ApplicationContext";
import { usePets } from "../../context/PetContext";
import {
  CIUDADES,
  ESPECIES,
  ESTADOS_MASCOTA,
  ESTADOS_SOLICITUD,
  SEXOS,
  TAMANOS,
} from "../../data/options";
import { TRANSICIONES_MASCOTA } from "../../utils/reglas";

const FILTROS_INICIALES = { texto: "", especie: "", refugioId: "", estado: "" };
const FORMULARIO_INICIAL = {
  nombre: "",
  raza: "",
  especie: "",
  edad: "",
  sexo: "",
  tamano: "",
  descripcion: "",
  ciudad: "",
  estado: ESTADOS_MASCOTA.DISPONIBLE,
  refugioId: "",
  vacunado: false,
  castrado: false,
  aptoNinos: false,
  aptoDepartamento: false,
};

// RN05, RN06, RN08, RN09, RN17, RN21, RN23 y RN24: administración de mascotas, respetando asociaciones, validaciones e historiales.
export default function AdminPets() {
  const {
    mascotas,
    refugios,
    obtenerRefugio,
    publicarMascotaAdmin,
    editarMascotaAdmin,
    eliminarMascota,
  } = usePets();
  const { solicitudesDeMascota } = useApplications();
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mascotaEditada, setMascotaEditada] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const mascotasVisibles = useMemo(() => {
    const texto = filtros.texto.trim().toLocaleLowerCase();
    return mascotas.filter(
      (mascota) =>
        (!texto || mascota.nombre.toLocaleLowerCase().includes(texto)) &&
        (!filtros.especie || mascota.especie === filtros.especie) &&
        (!filtros.refugioId ||
          mascota.refugioId === Number(filtros.refugioId)) &&
        (!filtros.estado || mascota.estado === filtros.estado),
    );
  }, [mascotas, filtros]);

  function abrirAlta() {
    setMascotaEditada(null);
    setFormulario({
      ...FORMULARIO_INICIAL,
      refugioId: refugios.find((refugio) => refugio.activo)?.id ?? "",
    });
    setErrores({});
    setMensaje(null);
    setModalAbierto(true);
  }

  function abrirEdicion(mascota) {
    setMascotaEditada(mascota);
    setFormulario({
      ...FORMULARIO_INICIAL,
      ...mascota,
      raza: mascota.raza ?? "",
      edad: String(mascota.edad),
      refugioId: String(mascota.refugioId),
    });
    setErrores({});
    setMensaje(null);
    setModalAbierto(true);
  }

  function cambiarCampo(evento) {
    const { name, value, type, checked } = evento.target;
    setFormulario((actual) => ({
      ...actual,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrores((actuales) => ({ ...actuales, [name]: "" }));
  }

  // RN05 y RN23: valida los datos obligatorios y los valores permitidos antes de guardar.
  // RN06, RN08 y RN24: evita asociaciones inexistentes y estados incompatibles con solicitudes activas.
  function validar() {
    const nuevos = {};
    [
      "nombre",
      "raza",
      "especie",
      "edad",
      "sexo",
      "tamano",
      "descripcion",
      "ciudad",
      "refugioId",
    ].forEach((campo) => {
      if (!String(formulario[campo] ?? "").trim())
        nuevos[campo] = "Este campo es obligatorio.";
    });
    if (
      formulario.edad !== "" &&
      (!Number.isInteger(Number(formulario.edad)) ||
        Number(formulario.edad) < 0 ||
        Number(formulario.edad) > 30)
    ) {
      nuevos.edad = "Ingresá una edad entera entre 0 y 30.";
    }
    const refugioValido = refugios.some(
      (refugio) =>
        refugio.id === Number(formulario.refugioId) &&
        (refugio.activo || refugio.id === mascotaEditada?.refugioId),
    );
    if (formulario.refugioId && !refugioValido) {
      nuevos.refugioId = "Seleccioná un refugio activo.";
    }
    if (!ESPECIES.includes(formulario.especie))
      nuevos.especie = "Seleccioná una especie válida.";
    if (!SEXOS.includes(formulario.sexo))
      nuevos.sexo = "Seleccioná un sexo válido.";
    if (!TAMANOS.includes(formulario.tamano))
      nuevos.tamano = "Seleccioná un tamaño válido.";
    if (!CIUDADES.includes(formulario.ciudad))
      nuevos.ciudad = "Seleccioná una ubicación válida.";
    const solicitudesActivas = mascotaEditada
      ? solicitudesDeMascota(mascotaEditada.id).filter((solicitud) =>
          [
            ESTADOS_SOLICITUD.PENDIENTE,
            ESTADOS_SOLICITUD.EN_EVALUACION,
          ].includes(solicitud.estado),
        )
      : [];
    if (
      mascotaEditada &&
      formulario.estado === ESTADOS_MASCOTA.INACTIVA &&
      solicitudesActivas.length > 0
    ) {
      nuevos.estado =
        "Resolvé las solicitudes activas antes de desactivar esta mascota.";
    }
    if (
      mascotaEditada &&
      formulario.estado === ESTADOS_MASCOTA.DISPONIBLE &&
      solicitudesActivas.some(
        (solicitud) => solicitud.estado === ESTADOS_SOLICITUD.EN_EVALUACION,
      )
    ) {
      nuevos.estado =
        "No se puede volver a Disponible mientras haya solicitudes en evaluación.";
    }
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  // RN05, RN06, RN08, RN21 y RN23: crea o actualiza la publicación mediante el estado compartido del proyecto.
  function guardar(evento) {
    evento.preventDefault();
    if (!validar()) return;
    const datos = {
      ...formulario,
      edad: Number(formulario.edad),
      refugioId: Number(formulario.refugioId),
    };
    const resultado = mascotaEditada
      ? editarMascotaAdmin(mascotaEditada.id, datos)
      : publicarMascotaAdmin(datos);
    if (!resultado.ok) {
      setErrores(resultado.errores ?? {});
      setMensaje({ tipo: "danger", texto: resultado.error });
      return;
    }
    setModalAbierto(false);
    setMensaje({
      tipo: "success",
      texto: mascotaEditada
        ? "La mascota se actualizó correctamente."
        : "La mascota se registró correctamente.",
    });
  }

  // RN09 y RN24: conserva el historial de solicitudes y confirma antes de borrar o desactivar una publicación.
  function confirmarEliminacion(mascota) {
    const tieneSolicitudes = solicitudesDeMascota(mascota.id).length > 0;
    const texto = tieneSolicitudes
      ? `${mascota.nombre} tiene solicitudes asociadas. Se conservará el historial y la publicación se intentará marcar como inactiva. ¿Continuar?`
      : `¿Eliminar el registro de ${mascota.nombre}? Esta acción no se puede deshacer.`;
    if (!window.confirm(texto)) return;
    const resultado = eliminarMascota(mascota.id, tieneSolicitudes);
    setMensaje(
      resultado.ok
        ? {
            tipo: "success",
            texto: resultado.desactivada
              ? "La mascota se marcó como inactiva para conservar sus solicitudes."
              : "La mascota se eliminó.",
          }
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
          <h1 className="h2 mb-1">Mascotas</h1>
          <p className="text-body-secondary mb-0">
            {mascotas.length} registros de todos los refugios.
          </p>
        </div>
        <Button onClick={abrirAlta}>Registrar mascota</Button>
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
            <Col xs={12} md={4}>
              <Form.Group controlId="buscar-mascota">
                <Form.Label>Buscar por nombre</Form.Label>
                <Form.Control
                  type="search"
                  value={filtros.texto}
                  onChange={(e) =>
                    setFiltros((v) => ({ ...v, texto: e.target.value }))
                  }
                  placeholder="Nombre de la mascota"
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={4} md={2}>
              <Form.Group controlId="filtrar-especie">
                <Form.Label>Especie</Form.Label>
                <Form.Select
                  value={filtros.especie}
                  onChange={(e) =>
                    setFiltros((v) => ({ ...v, especie: e.target.value }))
                  }
                >
                  <option value="">Todas</option>
                  {ESPECIES.map((especie) => (
                    <option key={especie}>{especie}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} sm={4} md={2}>
              <Form.Group controlId="filtrar-refugio">
                <Form.Label>Refugio</Form.Label>
                <Form.Select
                  value={filtros.refugioId}
                  onChange={(e) =>
                    setFiltros((v) => ({ ...v, refugioId: e.target.value }))
                  }
                >
                  <option value="">Todos</option>
                  {refugios.map((refugio) => (
                    <option key={refugio.id} value={refugio.id}>
                      {refugio.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} sm={4} md={2}>
              <Form.Group controlId="filtrar-estado-mascota">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={filtros.estado}
                  onChange={(e) =>
                    setFiltros((v) => ({ ...v, estado: e.target.value }))
                  }
                >
                  <option value="">Todos</option>
                  {Object.values(ESTADOS_MASCOTA).map((estado) => (
                    <option key={estado}>{estado}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={2}>
              <Button
                className="w-100"
                variant="outline-secondary"
                onClick={limpiarFiltros}
                disabled={!Object.values(filtros).some(Boolean)}
              >
                Limpiar filtros
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        {mascotas.length === 0 ? (
          <div className="p-4 text-center text-body-secondary">
            Todavía no hay mascotas registradas.
          </div>
        ) : mascotasVisibles.length === 0 ? (
          <div className="p-4 text-center text-body-secondary">
            No hay mascotas que coincidan con los filtros.
          </div>
        ) : (
          <Table responsive hover className="mb-0 align-middle">
            <thead>
              <tr>
                <th scope="col">Mascota</th>
                <th scope="col">Refugio</th>
                <th scope="col">Especie</th>
                <th scope="col">Raza</th>
                <th scope="col">Edad</th>
                <th scope="col">Ubicación</th>
                <th scope="col">Estado</th>
                <th scope="col">Solicitudes</th>
                <th scope="col" className="text-end">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {mascotasVisibles.map((mascota) => (
                <tr key={mascota.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={mascota.foto}
                        alt={`Imagen de ${mascota.nombre}`}
                        className="pc-miniatura-chica"
                      />
                      <Link to={`/mascotas/${mascota.id}`}>
                        {mascota.nombre}
                      </Link>
                    </div>
                  </td>
                  <td className="small">
                    {obtenerRefugio(mascota.refugioId)?.nombre ?? "Sin refugio"}
                  </td>
                  <td>{mascota.especie}</td>
                  <td>{mascota.raza || "Sin especificar"}</td>
                  <td>{edadEnTexto(mascota.edad)}</td>
                  <td>{mascota.ciudad}</td>
                  <td>
                    <EstadoMascota estado={mascota.estado} />
                  </td>
                  <td>{solicitudesDeMascota(mascota.id).length}</td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => abrirEdicion(mascota)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => confirmarEliminacion(mascota)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal
        show={modalAbierto}
        onHide={() => setModalAbierto(false)}
        centered
        size="lg"
      >
        <Form noValidate onSubmit={guardar}>
          <Modal.Header closeButton>
            <Modal.Title>
              {mascotaEditada ? "Editar mascota" : "Registrar mascota"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="admin-mascota-nombre">
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
              <Col md={6}>
                <Form.Group controlId="admin-mascota-raza">
                  <Form.Label>Raza</Form.Label>
                  <Form.Control
                    name="raza"
                    value={formulario.raza}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.raza)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.raza}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6} md={4}>
                <Form.Group controlId="admin-mascota-especie">
                  <Form.Label>Especie</Form.Label>
                  <Form.Select
                    name="especie"
                    value={formulario.especie}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.especie)}
                  >
                    <option value="">Seleccionar</option>
                    {ESPECIES.map((especie) => (
                      <option key={especie}>{especie}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errores.especie}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6} md={4}>
                <Form.Group controlId="admin-mascota-edad">
                  <Form.Label>Edad en años</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="30"
                    step="1"
                    name="edad"
                    value={formulario.edad}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.edad)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.edad}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6} md={4}>
                <Form.Group controlId="admin-mascota-sexo">
                  <Form.Label>Sexo</Form.Label>
                  <Form.Select
                    name="sexo"
                    value={formulario.sexo}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.sexo)}
                  >
                    <option value="">Seleccionar</option>
                    {SEXOS.map((sexo) => (
                      <option key={sexo}>{sexo}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errores.sexo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6} md={4}>
                <Form.Group controlId="admin-mascota-tamano">
                  <Form.Label>Tamaño</Form.Label>
                  <Form.Select
                    name="tamano"
                    value={formulario.tamano}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.tamano)}
                  >
                    <option value="">Seleccionar</option>
                    {TAMANOS.map((tamano) => (
                      <option key={tamano}>{tamano}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errores.tamano}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6} md={4}>
                <Form.Group controlId="admin-mascota-ciudad">
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Select
                    name="ciudad"
                    value={formulario.ciudad}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.ciudad)}
                  >
                    <option value="">Seleccionar</option>
                    {CIUDADES.map((ciudad) => (
                      <option key={ciudad}>{ciudad}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errores.ciudad}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6} md={4}>
                <Form.Group controlId="admin-mascota-refugio">
                  <Form.Label>Refugio</Form.Label>
                  <Form.Select
                    name="refugioId"
                    value={formulario.refugioId}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.refugioId)}
                  >
                    <option value="">Seleccionar</option>
                    {refugios
                      .filter(
                        (refugio) =>
                          refugio.activo ||
                          refugio.id === mascotaEditada?.refugioId,
                      )
                      .map((refugio) => (
                        <option key={refugio.id} value={refugio.id}>
                          {refugio.nombre}
                          {!refugio.activo ? " (inactivo)" : ""}
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errores.refugioId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="admin-mascota-estado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="estado"
                    value={formulario.estado}
                    onChange={cambiarCampo}
                    isInvalid={Boolean(errores.estado)}
                  >
                    {(mascotaEditada
                      ? [
                          mascotaEditada.estado,
                          ...(
                            TRANSICIONES_MASCOTA[mascotaEditada.estado] ?? []
                          ).filter(
                            (estado) => estado !== ESTADOS_MASCOTA.ADOPTADA,
                          ),
                        ]
                      : [ESTADOS_MASCOTA.DISPONIBLE]
                    ).map((estado) => (
                      <option key={estado}>{estado}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errores.estado}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="admin-mascota-descripcion">
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
              <Col xs={12}>
                <div className="d-flex flex-wrap gap-3">
                  <Form.Check
                    id="admin-vacunado"
                    name="vacunado"
                    label="Vacunado"
                    checked={formulario.vacunado}
                    onChange={cambiarCampo}
                  />
                  <Form.Check
                    id="admin-castrado"
                    name="castrado"
                    label="Castrado"
                    checked={formulario.castrado}
                    onChange={cambiarCampo}
                  />
                  <Form.Check
                    id="admin-apto-ninos"
                    name="aptoNinos"
                    label="Apto para niños"
                    checked={formulario.aptoNinos}
                    onChange={cambiarCampo}
                  />
                  <Form.Check
                    id="admin-apto-departamento"
                    name="aptoDepartamento"
                    label="Apto para departamento"
                    checked={formulario.aptoDepartamento}
                    onChange={cambiarCampo}
                  />
                </div>
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
    </Container>
  );
}
