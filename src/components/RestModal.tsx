import { useDialogFocus } from '../useDialogFocus';
import React from 'react';
import { sleepDuration } from '../state';

interface RestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecover: (amount: number, message: string) => void;
  sleepPlan: { bedtime: string; wakeTime: string };
  lastSleep?: { bedtime: string; wakeTime: string; quality: string; duration: number };
  onRecordSleep: (record: { bedtime: string; wakeTime: string; quality: string; duration: number }) => void;
}

export const RestModal: React.FC<RestModalProps> = ({ isOpen, onClose, onRecover, sleepPlan, lastSleep, onRecordSleep }) => {
  const [bedtime, setBedtime] = React.useState(sleepPlan.bedtime);
  const [wakeTime, setWakeTime] = React.useState(sleepPlan.wakeTime);
  const [quality, setQuality] = React.useState('restful');
  React.useEffect(() => { setBedtime(sleepPlan.bedtime); setWakeTime(sleepPlan.wakeTime); }, [sleepPlan.bedtime, sleepPlan.wakeTime]);
  const duration = sleepDuration(bedtime, wakeTime);
  const dialogRef = useDialogFocus(isOpen, onClose);
  if (!isOpen) return null;
  return (
    <div ref={dialogRef} tabIndex={-1} className="rest-modal" role="dialog" aria-modal="true" aria-labelledby="rest-title">
      <div className="card-pixel rest-modal__card">
        <div className="rest-modal__heading">
          <div><span>🛌 ESPAÇO DE RECUPERAÇÃO</span><h2 id="rest-title" className="pixel-title">Como seu corpo está?</h2></div>
          <button onClick={onClose} aria-label="Fechar recuperação">×</button>
        </div>
        <p>Descansar também é uma ação do turno. Registre o que realmente aconteceu — sem nota e sem punição.</p>
        <div className="sleep-checkin">
          <strong>Registrar noite</strong>
          <small>Planejado: {sleepPlan.bedtime} → {sleepPlan.wakeTime} · duração calculada automaticamente</small>
          <div className="welcome-form__grid"><label>Deitei<input type="time" value={bedtime} onChange={event => setBedtime(event.target.value)} /></label><label>Acordei<input type="time" value={wakeTime} onChange={event => setWakeTime(event.target.value)} /></label></div>
          <label>Como foi a qualidade?<select value={quality} onChange={event => setQuality(event.target.value)}><option value="restful">🌿 Reparador</option><option value="mixed">🌤️ Irregular</option><option value="poor">🌧️ Difícil</option></select></label>
          <p className="sleep-duration">{duration === undefined ? 'Preencha os dois horários.' : `${Math.floor(duration / 60)}h ${duration % 60}min registrados`}</p>
          <button className="btn-retro" disabled={duration === undefined} onClick={() => { if (duration !== undefined) onRecordSleep({ bedtime, wakeTime, quality, duration }); }}>Salvar registro da noite</button>
          {lastSleep && <small>Último registro: {Math.floor(lastSleep.duration / 60)}h {lastSleep.duration % 60}min · {lastSleep.quality === 'restful' ? 'reparador' : lastSleep.quality === 'mixed' ? 'irregular' : 'difícil'}</small>}
        </div>
        <p className="rest-modal__note">Sono é acompanhamento de rotina, não diagnóstico. Se as dificuldades persistirem, procure orientação profissional.</p>
        <div className="rest-options">
          <button className="btn-retro" onClick={() => onRecover(6, 'Pausa curta registrada. +6 AP.')}>☕ Pausa curta <small>+6 AP</small></button>
          <button className="btn-retro" onClick={() => onRecover(12, 'Sono protegido. +12 AP.')}>🌙 Sono protegido <small>+12 AP</small></button>
          <button className="btn-retro" onClick={() => onRecover(3, 'Respiração registrada. +3 AP.')}>🌿 Respirar um pouco <small>+3 AP</small></button>
        </div>
      </div>
    </div>
  );
};
