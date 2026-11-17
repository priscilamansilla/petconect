import { Alert, Col, Row } from 'react-bootstrap';
import PetCard from './PetCard';

export default function PetGrid({ mascotas, vacio }) {
  if (!mascotas.length) {
    return (
      <Alert variant="light" className="text-center border">
        {vacio ?? 'No hay mascotas que coincidan con la búsqueda.'}
      </Alert>
    );
  }

  return (
    <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
      {mascotas.map((mascota) => (
        <Col key={mascota.id}>
          <PetCard mascota={mascota} />
        </Col>
      ))}
    </Row>
  );
}
