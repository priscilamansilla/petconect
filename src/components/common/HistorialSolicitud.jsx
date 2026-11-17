import { usuarios } from '../../data/users';
import { EstadoSolicitud } from './EstadoBadge';
import { fechaEnTexto } from '../../utils/format';

function nombreDe(usuarioId) {
  const usuario = usuarios.find((u) => u.id === usuarioId);
  return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Sistema';
}

// Historial de cambios de una solicitud (RN22): estado, fecha, usuario
// responsable y motivo.
export default function HistorialSolicitud({ historial }) {
  return (
    <ol className="pc-historial list-unstyled mb-0">
      {historial.map((paso, indice) => (
        <li key={`${paso.estado}-${paso.fecha}-${indice}`} className="pc-historial-item">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
            <EstadoSolicitud estado={paso.estado} />
            <span className="small text-body-secondary">
              {fechaEnTexto(paso.fecha)} ·{' '}
              {nombreDe(paso.usuarioId)}
            </span>
          </div>
          <p className="small mb-0">{paso.motivo}</p>
        </li>
      ))}
    </ol>
  );
}
