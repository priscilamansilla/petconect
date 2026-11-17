import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container className="py-5 text-center">
      <p className="display-1 mb-0" aria-hidden="true">
        🐕
      </p>
      <h1 className="h2 mt-3">No encontramos esta página</h1>
      <p className="text-body-secondary mb-4">
        Puede que el enlace esté mal escrito o que la publicación ya no exista.
      </p>
      <Button as={Link} to="/" variant="primary">
        Volver al inicio
      </Button>
    </Container>
  );
}
