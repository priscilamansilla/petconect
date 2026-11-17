import { ProgressBar } from 'react-bootstrap';
import { leerPuntaje } from '../../utils/compatibility';

// Muestra el puntaje de compatibilidad (RN19). Es orientativo: no habilita
// ni bloquea la adopción (RN20).
export default function PuntajeCompatibilidad({ puntaje, compacto = false }) {
  if (puntaje === null || puntaje === undefined) return null;
  const { texto, color } = leerPuntaje(puntaje);

  if (compacto) {
    return (
      <div className="d-flex align-items-center gap-2">
        <ProgressBar
          now={puntaje}
          variant={color}
          className="flex-grow-1 pc-barra-compat"
          aria-label={`Compatibilidad ${puntaje} por ciento`}
        />
        <span className="small fw-semibold text-nowrap">{puntaje}%</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-end mb-1">
        <span className="fw-semibold">{texto}</span>
        <span className="fs-4 fw-bold">{puntaje}%</span>
      </div>
      <ProgressBar
        now={puntaje}
        variant={color}
        aria-label={`Compatibilidad ${puntaje} por ciento`}
      />
    </div>
  );
}
