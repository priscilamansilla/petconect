import { Alert, Button, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Deja pasar solo a los roles indicados (RN02 y RN03).
export default function RutaProtegida({ roles, children }) {
  const { usuarioActual } = useAuth();
  const ubicacion = useLocation();

  if (!usuarioActual) {
    return (
      <Container className="py-5">
        <Alert variant="light" className="border text-center p-5">
          <h1 className="h4">Necesitás iniciar sesión</h1>
          <p className="text-body-secondary">
            Esta sección es solo para usuarios registrados.
          </p>
          <Button
            as={Link}
            to="/ingresar"
            // Guardamos a dónde quería entrar, para devolverla ahí después
            // de que inicie sesión.
            state={{ desde: ubicacion.pathname }}
            variant="primary"
          >
            Ir a iniciar sesión
          </Button>
        </Alert>
      </Container>
    );
  }

  if (roles && !roles.includes(usuarioActual.rol)) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center p-5">
          <h1 className="h4">No tenés permiso para entrar acá</h1>
          <p className="mb-3">
            Tu cuenta es de tipo <strong>{usuarioActual.rol}</strong> y esta
            sección es para: {roles.join(', ')}.
          </p>
          <Button as={Link} to="/" variant="outline-dark">
            Volver al inicio
          </Button>
        </Alert>
      </Container>
    );
  }

  return children;
}
