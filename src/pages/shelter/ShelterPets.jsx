import { useState } from 'react';
import { Button, Card, Container, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EstadoMascota } from '../../components/common/EstadoBadge';
import PetForm from '../../components/pets/PetForm';
import { edadEnTexto } from '../../utils/format';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../context/PetContext';

export default function ShelterPets() {
  const { usuarioActual } = useAuth();
  const { mascotasDeRefugio } = usePets();
  const { solicitudesDeMascota } = useApplications();
  const [editando, setEditando] = useState(null);
  const [creando, setCreando] = useState(false);

  // RN06: el refugio solo administra las mascotas que publicó.
  const mias = mascotasDeRefugio(usuarioActual.refugioId);

  return (
    <Container className="py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h2 mb-1">Mis mascotas</h1>
          <p className="text-body-secondary mb-0">
            {mias.length} publicaciones a cargo del refugio.
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreando(true)}>
          Publicar una mascota
        </Button>
      </div>

      <Card>
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th scope="col">Mascota</th>
              <th scope="col">Especie</th>
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
            {mias.map((mascota) => {
              const solicitudes = solicitudesDeMascota(mascota.id);
              return (
                <tr key={mascota.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={mascota.foto} alt="" className="pc-miniatura-chica" />
                      <Link to={`/mascotas/${mascota.id}`}>{mascota.nombre}</Link>
                    </div>
                  </td>
                  <td>{mascota.especie}</td>
                  <td>{edadEnTexto(mascota.edad)}</td>
                  <td>{mascota.ciudad}</td>
                  <td>
                    <EstadoMascota estado={mascota.estado} />
                  </td>
                  <td>{solicitudes.length}</td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => setEditando(mascota)}
                    >
                      Editar
                    </Button>
                    {/* RN09: con solicitudes solo se puede desactivar. */}
                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={solicitudes.length > 0}
                      title={
                        solicitudes.length > 0
                          ? 'Tiene solicitudes: solo se puede desactivar la publicación'
                          : undefined
                      }
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <Modal
        show={creando || Boolean(editando)}
        onHide={() => {
          setCreando(false);
          setEditando(null);
        }}
        size="lg"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">
            {editando ? `Editar a ${editando.nombre}` : 'Publicar una mascota'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PetForm
            mascota={editando}
            onCancelar={() => {
              setCreando(false);
              setEditando(null);
            }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}
