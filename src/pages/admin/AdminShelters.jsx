import { Button, Card, Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { usePets } from '../../context/PetContext';
import { ESTADOS_MASCOTA } from '../../data/options';

export default function AdminShelters() {
  const { refugios, mascotas } = usePets();

  return (
    <Container className="py-5">
      <Link to="/admin" className="small">
        ← Volver a administración
      </Link>
      <h1 className="h2 mt-2 mb-4">Refugios</h1>

      <Card>
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th scope="col">Refugio</th>
              <th scope="col">Ciudad</th>
              <th scope="col">Contacto</th>
              <th scope="col">Publicaciones</th>
              <th scope="col">Disponibles</th>
              <th scope="col" className="text-end">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {refugios.map((refugio) => {
              const suyas = mascotas.filter((m) => m.refugioId === refugio.id);
              return (
                <tr key={refugio.id}>
                  <td className="fw-semibold">{refugio.nombre}</td>
                  <td>{refugio.ciudad}</td>
                  <td className="small">
                    {refugio.email}
                    <br />
                    {refugio.telefono}
                  </td>
                  <td>{suyas.length}</td>
                  <td>
                    {
                      suyas.filter(
                        (m) => m.estado === ESTADOS_MASCOTA.DISPONIBLE,
                      ).length
                    }
                  </td>
                  <td className="text-end">
                    <Button size="sm" variant="outline-primary">
                      Ver detalle
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}
