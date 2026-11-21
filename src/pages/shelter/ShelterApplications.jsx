import { useState } from 'react';
import {
  Accordion,
  Alert,
  Button,
  Card,
  Container,
  Form,
  Modal,
  Table,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EstadoSolicitud } from '../../components/common/EstadoBadge';
import HistorialSolicitud from '../../components/common/HistorialSolicitud';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../context/PetContext';
import { ESTADOS_SOLICITUD } from '../../data/options';
import { fechaEnTexto } from '../../utils/format';

export default function ShelterApplications() {
  const { usuarioActual, usuarios } = useAuth();
  const { mascotasDeRefugio, obtenerMascota } = usePets();
  const { solicitudes, cambiarEstadoSolicitud, aprobarSolicitud } =
    useApplications();
  const [aviso, setAviso] = useState(null);
  const [rechazando, setRechazando] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [errorMotivo, setErrorMotivo] = useState('');

  const idsMascotas = mascotasDeRefugio(usuarioActual.refugioId).map((m) => m.id);
  // RN12: el refugio revisa las solicitudes de sus propias mascotas.
  const mias = solicitudes.filter((s) => idsMascotas.includes(s.mascotaId));

  // Se leen los usuarios del contexto (no de data/users) para que aparezcan
  // también las personas que se registraron después.
  function adoptante(id) {
    const usuario = usuarios.find((u) => u.id === id);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : '—';
  }

  function mostrarResultado(resultado, textoExito) {
    setAviso(
      resultado.ok
        ? { variant: 'success', texto: textoExito }
        : { variant: 'danger', texto: resultado.error },
    );
  }

  function pasarAEvaluacion(solicitud) {
    const resultado = cambiarEstadoSolicitud(
      solicitud.id,
      ESTADOS_SOLICITUD.EN_EVALUACION,
      usuarioActual.id,
    );
    mostrarResultado(resultado, 'La solicitud pasó a evaluación.');
  }

  // RN14, RN15 y RN16: al aprobar, la mascota queda adoptada y las demás
  // solicitudes activas de esa mascota se cancelan solas.
  function aprobar(solicitud) {
    const mascota = obtenerMascota(solicitud.mascotaId);
    const confirmado = window.confirm(
      `¿Aprobar la adopción de ${mascota?.nombre}? La mascota pasa a «Adoptada» y se cancelan las demás solicitudes activas.`,
    );
    if (!confirmado) return;

    const resultado = aprobarSolicitud(solicitud.id, usuarioActual.id);
    mostrarResultado(
      resultado,
      `Aprobaste la solicitud. ${mascota?.nombre} quedó adoptada.`,
    );
  }

  function abrirRechazo(solicitud) {
    setRechazando(solicitud);
    setMotivo('');
    setErrorMotivo('');
  }

  function cerrarRechazo() {
    setRechazando(null);
    setMotivo('');
    setErrorMotivo('');
  }

  // El motivo del rechazo es obligatorio y queda en el historial (RN22).
  function confirmarRechazo() {
    const resultado = cambiarEstadoSolicitud(
      rechazando.id,
      ESTADOS_SOLICITUD.RECHAZADA,
      usuarioActual.id,
      motivo,
    );
    if (!resultado.ok) {
      setErrorMotivo(resultado.error);
      return;
    }
    mostrarResultado(resultado, 'La solicitud fue rechazada.');
    cerrarRechazo();
  }

  return (
    <Container className="py-5">
      <h1 className="h2 mb-1">Solicitudes recibidas</h1>
      <p className="text-body-secondary mb-4">
        {mias.length} solicitudes sobre las mascotas del refugio.
      </p>

      {aviso && (
        <Alert variant={aviso.variant} onClose={() => setAviso(null)} dismissible>
          {aviso.texto}
        </Alert>
      )}

      <Card>
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th scope="col">Mascota</th>
              <th scope="col">Adoptante</th>
              <th scope="col">Fecha</th>
              <th scope="col">Estado</th>
              <th scope="col" className="text-end">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {mias.map((solicitud) => {
              const mascota = obtenerMascota(solicitud.mascotaId);
              const pendiente = solicitud.estado === ESTADOS_SOLICITUD.PENDIENTE;
              const enEvaluacion =
                solicitud.estado === ESTADOS_SOLICITUD.EN_EVALUACION;

              return (
                <tr key={solicitud.id}>
                  <td>
                    <Link to={`/mascotas/${mascota?.id}`}>{mascota?.nombre}</Link>
                  </td>
                  <td>{adoptante(solicitud.adoptanteId)}</td>
                  <td>{fechaEnTexto(solicitud.fecha)}</td>
                  <td>
                    <EstadoSolicitud estado={solicitud.estado} />
                  </td>
                  <td className="text-end text-nowrap">
                    {pendiente && (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => pasarAEvaluacion(solicitud)}
                      >
                        Pasar a evaluación
                      </Button>
                    )}
                    {/* RN14: solo se aprueba desde "En evaluación". */}
                    {enEvaluacion && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          className="me-2"
                          onClick={() => aprobar(solicitud)}
                        >
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => abrirRechazo(solicitud)}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                    {!pendiente && !enEvaluacion && (
                      <span className="small text-body-secondary">
                        Sin acciones
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <h2 className="h5 mt-5 mb-3">Detalle de cada solicitud</h2>
      <Accordion alwaysOpen>
        {mias.map((solicitud) => (
          <Accordion.Item eventKey={String(solicitud.id)} key={solicitud.id}>
            <Accordion.Header>
              {obtenerMascota(solicitud.mascotaId)?.nombre} ·{' '}
              {adoptante(solicitud.adoptanteId)}
            </Accordion.Header>
            <Accordion.Body>
              <p className="fst-italic">«{solicitud.mensaje}»</p>
              <h3 className="h6 mt-4">Historial</h3>
              <HistorialSolicitud historial={solicitud.historial} />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <Modal show={Boolean(rechazando)} onHide={cerrarRechazo} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5">
            Rechazar la solicitud
            {rechazando &&
              ` de ${adoptante(rechazando.adoptanteId)} por ${
                obtenerMascota(rechazando.mascotaId)?.nombre
              }`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="rechazo-motivo">
            <Form.Label>Motivo del rechazo *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              isInvalid={Boolean(errorMotivo)}
            />
            <Form.Control.Feedback type="invalid">
              {errorMotivo}
            </Form.Control.Feedback>
            <Form.Text>
              Queda en el historial y lo puede ver quien hizo la solicitud.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={cerrarRechazo}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarRechazo}>
            Rechazar solicitud
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
