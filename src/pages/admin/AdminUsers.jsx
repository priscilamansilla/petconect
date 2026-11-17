import { Badge, Button, Card, Container, Form, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { usuarios } = useAuth();

  return (
    <Container className="py-5">
      <Link to="/admin" className="small">
        ← Volver a administración
      </Link>
      <h1 className="h2 mt-2 mb-1">Usuarios</h1>
      <p className="text-body-secondary mb-4">
        Solo la administración puede gestionar cuentas y roles (RN03).
      </p>

      <Card>
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Correo</th>
              <th scope="col">Ciudad</th>
              <th scope="col">Rol</th>
              <th scope="col">Estado</th>
              <th scope="col" className="text-end">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>
                  {usuario.nombre} {usuario.apellido}
                </td>
                <td className="small">{usuario.email}</td>
                <td>{usuario.ciudad}</td>
                <td>
                  <Form.Select size="sm" defaultValue={usuario.rol} disabled>
                    <option value="adoptante">adoptante</option>
                    <option value="refugio">refugio</option>
                    <option value="administrador">administrador</option>
                  </Form.Select>
                </td>
                <td>
                  <Badge bg={usuario.activo ? 'success' : 'secondary'}>
                    {usuario.activo ? 'Activo' : 'Desactivado'}
                  </Badge>
                </td>
                <td className="text-end">
                  <Button
                    size="sm"
                    variant={
                      usuario.activo ? 'outline-danger' : 'outline-success'
                    }
                  >
                    {usuario.activo ? 'Desactivar' : 'Reactivar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <p className="small text-body-secondary mt-3">
        Un usuario desactivado no puede iniciar sesión ni operar, pero sus
        registros históricos se conservan (RN04).
      </p>
    </Container>
  );
}
