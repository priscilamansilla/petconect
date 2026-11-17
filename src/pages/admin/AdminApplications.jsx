import { useState } from 'react';
import { Button, Card, Container, Form, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EstadoSolicitud } from '../../components/common/EstadoBadge';
import HistorialSolicitud from '../../components/common/HistorialSolicitud';
import { useApplications } from '../../context/ApplicationContext';
import { usePets } from '../../context/PetContext';
import { ESTADOS_SOLICITUD } from '../../data/options';
import { usuarios } from '../../data/users';
import { fechaEnTexto } from '../../utils/format';

export default function AdminApplications() {
  const { solicitudes } = useApplications();
  const { obtenerMascota, obtenerRefugio } = usePets();
  const [filtro, setFiltro] = useState('');
  const [detalle, setDetalle] = useState(null);

  const visibles = filtro
    ? solicitudes.filter((s) => s.estado === filtro)
    : solicitudes;

  function adoptante(id) {
    const usuario = usuarios.find((u) => u.id === id);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : '—';
  }

  return (
    <Container className="py-5">
      <Link to="/admin" className="small">
        ← Volver a administración
      </Link>

      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mt-2 mb-4">
        <div>
          <h1 className="h2 mb-1">Solicitudes</h1>
          <p className="text-body-secondary mb-0">
            Supervisión de todas las solicitudes de la plataforma (RN21).
          </p>
        </div>
        <Form.Group controlId="filtro-estado-solicitud">
          <Form.Label className="small mb-1">Filtrar por estado</Form.Label>
          <Form.Select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            {Object.values(ESTADOS_SOLICITUD).map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      <Card>
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th scope="col">#</th>
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
                  <td>{mascota?.nombre}</td>
                  <td className="small">
                    {obtenerRefugio(mascota?.refugioId)?.nombre}
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
                      onClick={() => setDetalle(solicitud)}
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              );
            })}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-body-secondary py-4">
                  No hay solicitudes en ese estado.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      <Modal show={Boolean(detalle)} onHide={() => setDetalle(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5">
            Solicitud #{detalle?.id} ·{' '}
            {obtenerMascota(detalle?.mascotaId)?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fst-italic">«{detalle?.mensaje}»</p>
          <h3 className="h6 mt-4">Historial de cambios</h3>
          {detalle && <HistorialSolicitud historial={detalle.historial} />}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
