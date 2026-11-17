import { Badge } from 'react-bootstrap';
import {
  COLOR_ESTADO_MASCOTA,
  COLOR_ESTADO_SOLICITUD,
} from '../../data/options';

export function EstadoMascota({ estado }) {
  return <Badge bg={COLOR_ESTADO_MASCOTA[estado] ?? 'secondary'}>{estado}</Badge>;
}

export function EstadoSolicitud({ estado }) {
  return (
    <Badge bg={COLOR_ESTADO_SOLICITUD[estado] ?? 'secondary'}>{estado}</Badge>
  );
}
