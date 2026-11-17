import { Accordion, Button, Card, Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EstadoSolicitud } from '../../components/common/EstadoBadge';
import HistorialSolicitud from '../../components/common/HistorialSolicitud';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../context/PetContext';
import { ESTADOS_SOLICITUD } from '../../data/options';
import { usuarios } from '../../data/users';
import { fechaEnTexto } from '../../utils/format';

export default function ShelterApplications() {
  const { usuarioActual } = useAuth();
  const { mascotasDeRefugio, obtenerMascota } = usePets();
  const { solicitudes } = useApplications();

  const idsMascotas = mascotasDeRefugio(usuarioActual.refugioId).map((m) => m.id);
  // RN12: el refugio revisa las solicitudes de sus propias mascotas.
  const mias = solicitudes.filter((s) => idsMascotas.includes(s.mascotaId));

  function adoptante(id) {
    const usuario = usuarios.find((u) => u.id === id);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : '—';
  }

  return (
    <Container className="py-5">
      <h1 className="h2 mb-1">Solicitudes recibidas</h1>
      <p className="text-body-secondary mb-4">
        {mias.length} solicitudes sobre las mascotas del refugio.
      </p>

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
                      <Button size="sm" variant="outline-primary">
                        Pasar a evaluación
                      </Button>
                    )}
                    {/* RN14: solo se aprueba desde "En evaluación". */}
                    {enEvaluacion && (
                      <>
                        <Button size="sm" variant="success" className="me-2">
                          Aprobar
                        </Button>
                        <Button size="sm" variant="outline-danger">
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
    </Container>
  );
}
