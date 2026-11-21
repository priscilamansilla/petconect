import { useState } from 'react';
import { Alert, Button, Card, Container, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EstadoMascota } from '../../components/common/EstadoBadge';
import PetForm from '../../components/pets/PetForm';
import { edadEnTexto } from '../../utils/format';
import { ESTADOS_MASCOTA } from '../../data/options';
import { transicionValidaMascota } from '../../utils/reglas';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../context/PetContext';

export default function ShelterPets() {
  const { usuarioActual } = useAuth();
  const { mascotasDeRefugio, publicarMascota, editarMascota, eliminarMascota } =
    usePets();
  const { solicitudesDeMascota } = useApplications();
  const [editando, setEditando] = useState(null);
  const [creando, setCreando] = useState(false);
  const [aviso, setAviso] = useState(null);

  // RN06: el refugio solo administra las mascotas que publicó.
  const mias = mascotasDeRefugio(usuarioActual.refugioId);

  function cerrarFormulario() {
    setCreando(false);
    setEditando(null);
  }

  // RN05 y RN06: el formulario ya validó los campos; acá se guarda y, si salió
  // bien, se cierra. Si salió mal, el resultado vuelve al formulario para que
  // muestre el error.
  function guardar(datos) {
    const resultado = editando
      ? editarMascota(editando.id, datos)
      : publicarMascota(datos);

    if (resultado.ok) {
      setAviso({
        variant: 'success',
        texto: editando
          ? `Guardaste los cambios de ${datos.nombre}.`
          : `${datos.nombre} ya está publicada.`,
      });
      cerrarFormulario();
    }
    return resultado;
  }

  // RN09: con solicitudes la publicación se desactiva; sin solicitudes se
  // elimina de verdad.
  function quitar(mascota, tieneSolicitudes) {
    const pregunta = tieneSolicitudes
      ? `¿Desactivar la publicación de ${mascota.nombre}? Ya no va a recibir solicitudes.`
      : `¿Eliminar la publicación de ${mascota.nombre}? Esta acción no se puede deshacer.`;
    if (!window.confirm(pregunta)) return;

    const resultado = eliminarMascota(mascota.id, tieneSolicitudes);
    if (resultado.ok) {
      setAviso({
        variant: 'success',
        texto: resultado.desactivada
          ? `${mascota.nombre} quedó inactiva.`
          : `Se eliminó la publicación de ${mascota.nombre}.`,
      });
    } else {
      setAviso({ variant: 'danger', texto: resultado.error });
    }
  }

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
              const tieneSolicitudes = solicitudes.length > 0;
              // Con solicitudes solo se puede desactivar, y eso solo si el
              // estado actual lo permite (una mascota adoptada o ya inactiva
              // no tiene nada más para hacer).
              const sePuedeQuitar =
                !tieneSolicitudes ||
                transicionValidaMascota(mascota.estado, ESTADOS_MASCOTA.INACTIVA);

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
                      disabled={!sePuedeQuitar}
                      title={
                        tieneSolicitudes
                          ? 'Tiene solicitudes: solo se puede desactivar la publicación'
                          : undefined
                      }
                      onClick={() => quitar(mascota, tieneSolicitudes)}
                    >
                      {tieneSolicitudes ? 'Desactivar' : 'Eliminar'}
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
        onHide={cerrarFormulario}
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
            onGuardar={guardar}
            onCancelar={cerrarFormulario}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}
