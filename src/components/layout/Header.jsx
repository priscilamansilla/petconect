import { Badge, Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { restablecerDatos } from '../../hooks/useEstadoGuardado';

export default function Header() {
  const {
    usuarios,
    usuarioActual,
    cerrarSesion,
    cambiarUsuarioDemo,
    esAdoptante,
    esRefugio,
    esAdmin,
  } = useAuth();
  const navegar = useNavigate();

  function salir() {
    cerrarSesion();
    navegar('/');
  }

  return (
    <Navbar
      expand="lg"
      className="pc-navbar shadow-sm"
      sticky="top"
      variant="dark"
    >
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

            {usuarioActual ? (
              <NavDropdown
                align="end"
                id="menu-cuenta"
                title={`Hola, ${usuarioActual.nombre}`}
              >
                {esAdoptante && (
                  <>
                    <NavDropdown.Item as={Link} to="/mi-cuenta">
                      Mi cuenta
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/perfil">
                      Mi perfil
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}
                <NavDropdown.Item onClick={salir}>
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2 my-2 my-lg-0 ms-lg-2">
                <Button as={Link} to="/ingresar" variant="outline-light" size="sm">
                  Ingresar
                </Button>
                <Button as={Link} to="/registrarme" variant="light" size="sm">
                  Crear cuenta
                </Button>
              </div>
            )}

            {/* Atajo que existe solo mientras desarrollamos: deja entrar como
                cualquier usuario sin escribir la contraseña, y restablecer
                los datos. Hay que borrarlo antes de entregar. */}
            <NavDropdown
              align="end"
              id="menu-demo"
              title={
                <Badge bg="warning" text="dark">
                  demo
                </Badge>
              }
            >
              <NavDropdown.Header>Entrar como...</NavDropdown.Header>
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
              <NavDropdown.Item onClick={restablecerDatos}>
                Restablecer datos de ejemplo
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
