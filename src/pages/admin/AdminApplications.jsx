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
import { EstadoSolicitud } from "../../components/common/EstadoBadge";
import HistorialSolicitud from "../../components/common/HistorialSolicitud";
import { useAuth } from "../../context/AuthContext";
import { useApplications } from "../../context/ApplicationContext";
import { usePets } from "../../context/PetContext";
import { ESTADOS_SOLICITUD } from "../../data/options";
import { fechaEnTexto } from "../../utils/format";

const TIPO_ADOPCION = "Adopción";
const FILTROS_INICIALES = {
  texto: "",
  estado: "",
  desde: "",
  hasta: "",
  tipo: "",
};

// RN12, RN13, RN14, RN21, RN22, RN23 y RN24: supervisión de solicitudes de adopción con transiciones e historial.
export default function AdminApplications() {
  const { solicitudes, cambiarEstadoSolicitud, aprobarSolicitud } =
    useApplications();
  const { obtenerMascota, obtenerRefugio } = usePets();
  const { usuarios, usuarioActual } = useAuth();
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [detalleId, setDetalleId] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [errorRechazo, setErrorRechazo] = useState("");

  const visibles = useMemo(() => {
    const texto = filtros.texto.trim().toLocaleLowerCase();
    return solicitudes.filter((solicitud) => {
      const usuario = usuarios.find((u) => u.id === solicitud.adoptanteId);
      const nombreUsuario = usuario
        ? `${usuario.nombre} ${usuario.apellido} ${usuario.email}`.toLocaleLowerCase()
        : "";
      const coincideTexto =
        !texto ||
        String(solicitud.id).includes(texto) ||
        nombreUsuario.includes(texto);
      const coincideEstado =
        !filtros.estado || solicitud.estado === filtros.estado;
      const coincideTipo = !filtros.tipo || filtros.tipo === TIPO_ADOPCION;
      const coincideDesde = !filtros.desde || solicitud.fecha >= filtros.desde;
      const coincideHasta = !filtros.hasta || solicitud.fecha <= filtros.hasta;
      return (
        coincideTexto &&
        coincideEstado &&
        coincideTipo &&
        coincideDesde &&
        coincideHasta
      );
    });
  }, [solicitudes, usuarios, filtros]);

  const detalle =
    solicitudes.find((solicitud) => solicitud.id === detalleId) ?? null;
  const mascotaDetalle = detalle ? obtenerMascota(detalle.mascotaId) : null;
  const refugioDetalle = mascotaDetalle
    ? obtenerRefugio(mascotaDetalle.refugioId)
    : null;

  function adoptante(id) {
    const usuario = usuarios.find((u) => u.id === Number(id));
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : "—";
  }

  function limpiarFiltros() {
    setFiltros(FILTROS_INICIALES);
  }

  // RN12, RN13, RN14, RN22 y RN24: aplica solo transiciones autorizadas y confirma acciones importantes.
  function ejecutarTransicion(estado, motivo = "") {
    if (!detalle || !usuarioActual) return;
    const confirmar =
      estado === ESTADOS_SOLICITUD.APROBADA
        ? "¿Aprobar esta adopción? Las demás solicitudes activas de la mascota se cancelarán."
        : estado === ESTADOS_SOLICITUD.EN_EVALUACION
          ? "¿Pasar esta solicitud a evaluación?"
          : "¿Rechazar esta solicitud con el motivo indicado?";
    if (!window.confirm(confirmar)) return;

    const resultado =
      estado === ESTADOS_SOLICITUD.APROBADA
        ? aprobarSolicitud(detalle.id, usuarioActual.id)
        : cambiarEstadoSolicitud(detalle.id, estado, usuarioActual.id, motivo);
    if (!resultado.ok) {
      setMensaje({ tipo: "danger", texto: resultado.error });
      return;
    }
    setMensaje({
      tipo: "success",
      texto: `La solicitud #${detalle.id} se actualizó correctamente.`,
    });
    setMotivoRechazo("");
    setErrorRechazo("");
  }

  // RN13 y RN23: exige un motivo antes de solicitar el rechazo.
  function rechazarSolicitud() {
    if (!motivoRechazo.trim()) {
      setErrorRechazo("Escribí el motivo del rechazo.");
      return;
    }
    ejecutarTransicion(ESTADOS_SOLICITUD.RECHAZADA, motivoRechazo.trim());
  }

  return (
    <Container className="py-5">
      <Link to="/admin" className="small">
        ← Volver a administración
      </Link>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-2 mb-4">
        <div>
          <h1 className="h2 mb-1">Solicitudes</h1>
          <p className="text-body-secondary mb-0">
            Supervisión de las solicitudes de adopción de la plataforma (RN21).
          </p>
        </div>
        <Badge bg="info" text="dark">
          Tipo disponible: adopción
        </Badge>
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
              <Form.Group controlId="buscar-solicitud">
                <Form.Label>Buscar por ID o usuario</Form.Label>
                <Form.Control
                  type="search"
                  value={filtros.texto}
                  onChange={(e) =>
                    setFiltros((v) => ({ ...v, texto: e.target.value }))
                  }
                  placeholder="Número, nombre, apellido o correo"
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group controlId="tipo-solicitud">
                <Form.Label>Tipo</Form.Label>
                <Form.Select
                  value={filtros.tipo}
                  onChange={(e) =>
                    setFiltros((v) => ({ ...v, tipo: e.target.value }))
                  }
                >
                  <option value="">Todos</option>
                  <option value={TIPO_ADOPCION}>{TIPO_ADOPCION}</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group controlId="estado-solicitud">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={filtros.estado}
                  onChange={(e) =>
                    setFiltros((v) => ({ ...v, estado: e.target.value }))
                  }
                >
                  <option value="">Todos</option>
                  {Object.values(ESTADOS_SOLICITUD).map((estado) => (
                    <option key={estado}>{estado}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group controlId="fecha-desde">
                <Form.Label>Desde</Form.Label>
                <Form.Control
                  type="date"
                  value={filtros.desde}
                  onChange={(e) =>
                    setFiltros((v) => ({ ...v, desde: e.target.value }))
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group controlId="fecha-hasta">
                <Form.Label>Hasta</Form.Label>
                <Form.Control
                  type="date"
                  value={filtros.hasta}
                  onChange={(e) =>
                    setFiltros((v) => ({ ...v, hasta: e.target.value }))
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Button
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
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tipo</th>
              <th scope="col">Mascota</th>
              <th scope="col">Refugio</th>
              <th scope="col">Adoptante</th>
              <th scope="col">Fecha</th>
              <th scope="col">Estado</th>
              <th scope="col" className="text-end">
                Historial
              </th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((solicitud) => {
              const mascota = obtenerMascota(solicitud.mascotaId);
              return (
                <tr key={solicitud.id}>
                  <td className="text-body-secondary">{solicitud.id}</td>
                  <td>{TIPO_ADOPCION}</td>
                  <td>{mascota?.nombre ?? "Mascota no disponible"}</td>
                  <td className="small">
                    {obtenerRefugio(mascota?.refugioId)?.nombre ?? "—"}
                  </td>
                  <td>{adoptante(solicitud.adoptanteId)}</td>
                  <td>{fechaEnTexto(solicitud.fecha)}</td>
                  <td>
                    <EstadoSolicitud estado={solicitud.estado} />
                  </td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => {
                        setDetalleId(solicitud.id);
                        setMensaje(null);
                        setErrorRechazo("");
                        setMotivoRechazo("");
                      }}
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              );
            })}
            {visibles.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center text-body-secondary py-4"
                >
                  {solicitudes.length === 0
                    ? "Todavía no hay solicitudes registradas."
                    : "No hay solicitudes que coincidan con los filtros."}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      <Modal
        show={Boolean(detalle)}
        onHide={() => {
          setDetalleId(null);
          setMotivoRechazo("");
          setErrorRechazo("");
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">
            Solicitud #{detalle?.id} ·{" "}
            {mascotaDetalle?.nombre ?? "Mascota no disponible"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}
          <dl className="row mb-3">
            <dt className="col-sm-4">Tipo</dt>
            <dd className="col-sm-8">{TIPO_ADOPCION}</dd>
            <dt className="col-sm-4">Usuario</dt>
            <dd className="col-sm-8">
              {detalle ? adoptante(detalle.adoptanteId) : "—"}
            </dd>
            <dt className="col-sm-4">Refugio</dt>
            <dd className="col-sm-8">{refugioDetalle?.nombre ?? "—"}</dd>
            <dt className="col-sm-4">Fecha</dt>
            <dd className="col-sm-8">
              {detalle ? fechaEnTexto(detalle.fecha) : "—"}
            </dd>
            <dt className="col-sm-4">Estado</dt>
            <dd className="col-sm-8">
              {detalle && <EstadoSolicitud estado={detalle.estado} />}
            </dd>
            <dt className="col-sm-4">Descripción</dt>
            <dd className="col-sm-8">
              {detalle?.mensaje || "Sin descripción"}
            </dd>
          </dl>
          <h3 className="h6 mt-4">Historial de cambios</h3>
          {detalle && <HistorialSolicitud historial={detalle.historial} />}
          {detalle?.estado === ESTADOS_SOLICITUD.EN_EVALUACION && (
            <div className="mt-4">
              <Form.Group controlId="motivo-rechazo">
                <Form.Label>
                  Motivo del rechazo (obligatorio para rechazar)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={motivoRechazo}
                  onChange={(e) => {
                    setMotivoRechazo(e.target.value);
                    setErrorRechazo("");
                  }}
                  isInvalid={Boolean(errorRechazo)}
                />
                <Form.Control.Feedback type="invalid">
                  {errorRechazo}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button
            variant="outline-secondary"
            onClick={() => setDetalleId(null)}
          >
            Cerrar
          </Button>
          {detalle?.estado === ESTADOS_SOLICITUD.PENDIENTE && (
            <Button
              variant="info"
              onClick={() =>
                ejecutarTransicion(ESTADOS_SOLICITUD.EN_EVALUACION)
              }
            >
              Pasar a evaluación
            </Button>
          )}
          {detalle?.estado === ESTADOS_SOLICITUD.EN_EVALUACION && (
            <div className="d-flex gap-2">
              <Button variant="outline-danger" onClick={rechazarSolicitud}>
                Rechazar
              </Button>
              <Button
                variant="success"
                onClick={() => ejecutarTransicion(ESTADOS_SOLICITUD.APROBADA)}
              >
                Aprobar
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
