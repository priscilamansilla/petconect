import { Button, Card, Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EstadoMascota } from '../../components/common/EstadoBadge';
import { edadEnTexto } from '../../utils/format';
import { useApplications } from '../../context/ApplicationContext';
import { usePets } from '../../context/PetContext';

export default function AdminPets() {
  const { mascotas, obtenerRefugio } = usePets();
  const { solicitudesDeMascota } = useApplications();

  return (
    <Container className="py-5">
      <Link to="/admin" className="small">
        ← Volver a administración
      </Link>
      <h1 className="h2 mt-2 mb-1">Mascotas</h1>
      <p className="text-body-secondary mb-4">
        {mascotas.length} publicaciones de todos los refugios.
      </p>

      <Card>
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th scope="col">Mascota</th>
              <th scope="col">Refugio</th>
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
            {mascotas.map((mascota) => (
              <tr key={mascota.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img src={mascota.foto} alt="" className="pc-miniatura-chica" />
                    <Link to={`/mascotas/${mascota.id}`}>{mascota.nombre}</Link>
                  </div>
                </td>
                <td className="small">
                  {obtenerRefugio(mascota.refugioId)?.nombre}
                </td>
                <td>{mascota.especie}</td>
                <td>{edadEnTexto(mascota.edad)}</td>
                <td>{mascota.ciudad}</td>
                <td>
                  <EstadoMascota estado={mascota.estado} />
                </td>
                <td>{solicitudesDeMascota(mascota.id).length}</td>
                <td className="text-end">
                  <Button size="sm" variant="outline-secondary">
                    Desactivar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}
