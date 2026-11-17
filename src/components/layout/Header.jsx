import { Badge, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const {
    usuarios,
    usuarioActual,
    cambiarUsuarioDemo,
    esAdoptante,
    esRefugio,
    esAdmin,
  } = useAuth();

  return (
    <Navbar expand="lg" className="pc-navbar shadow-sm" sticky="top" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <span aria-hidden="true">🐾</span> PET
          <span className="pc-brand-accent">CONECT</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/mascotas">
              Mascotas
            </Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">
              Nosotros
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">
              Contacto
            </Nav.Link>
          </Nav>

          <Nav className="align-items-lg-center">
            {esAdoptante && (
              <>
                <Nav.Link as={NavLink} to="/favoritos">
                  Favoritos
                </Nav.Link>
                <Nav.Link as={NavLink} to="/mis-solicitudes">
                  Mis solicitudes
                </Nav.Link>
                <Nav.Link as={NavLink} to="/mi-cuenta">
                  Mi cuenta
                </Nav.Link>
              </>
            )}

            {esRefugio && (
              <NavDropdown title="Mi refugio" id="menu-refugio">
                <NavDropdown.Item as={Link} to="/refugio">
                  Panel
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/refugio/mascotas">
                  Mis mascotas
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/refugio/solicitudes">
                  Solicitudes recibidas
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/refugio/perfil">
                  Datos del refugio
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {esAdmin && (
              <NavDropdown title="Administración" id="menu-admin">
                <NavDropdown.Item as={Link} to="/admin">
                  Panel
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/usuarios">
                  Usuarios
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/refugios">
                  Refugios
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/mascotas">
                  Mascotas
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/solicitudes">
                  Solicitudes
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {/* Selector que existe solo mientras esto es una maqueta: deja
                recorrer la aplicación con cada rol sin pasar por el login.
                Se borra cuando la autenticación esté hecha. */}
            <NavDropdown
              align="end"
              id="selector-usuario-demo"
              title={
                <span>
                  <Badge bg="warning" text="dark" className="me-2">
                    demo
                  </Badge>
                  {usuarioActual ? usuarioActual.nombre : 'Sin sesión'}
                </span>
              }
            >
              <NavDropdown.Header>Ver la app como...</NavDropdown.Header>
              {usuarios.map((usuario) => (
                <NavDropdown.Item
                  key={usuario.id}
                  active={usuario.id === usuarioActual?.id}
                  onClick={() => cambiarUsuarioDemo(usuario.id)}
                >
                  {usuario.nombre} {usuario.apellido}
                  <span className="text-body-secondary small">
                    {' — '}
                    {usuario.rol}
                    {!usuario.activo && ' (inactivo)'}
                  </span>
                </NavDropdown.Item>
              ))}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => cambiarUsuarioDemo(null)}>
                Cerrar sesión
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/ingresar">
                Ir a la pantalla de login
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
