import { useDialogFocus } from '../useDialogFocus';
import React, { useState } from 'react';
import { FinancePot } from '../types';

export interface StarterSetup {
  course: string;
  className: string;
  classTime: string;
  hasWork: boolean;
  workTitle: string;
  workTime: string;
  sleepTime: string;
  wakeTime: string;
}

interface WelcomeModalProps {
  onClose?: () => void;
  onStart: (pots: FinancePot[], dayLabel: string, setup: StarterSetup) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStart, onClose }) => {
  const dialogRef = useDialogFocus(true, onClose);
  const [dayLabel, setDayLabel] = useState('Minha semana');
  const [budget, setBudget] = useState({ essential: '180', flexible: '70', reserve: '50' });
  const [setup, setSetup] = useState<StarterSetup>({ course: '', className: '', classTime: '08:00', hasWork: false, workTitle: 'Estágio', workTime: '14:00', sleepTime: '23:00', wakeTime: '07:00' });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const values = [
      { id: 'essential' as const, label: 'Essenciais', color: 'var(--slate-focus)', value: budget.essential },
      { id: 'flexible' as const, label: 'Lazer / Flexível', color: 'var(--amber-warm)', value: budget.flexible },
      { id: 'reserve' as const, label: 'Reserva de Emergência', color: 'var(--sage-calm)', value: budget.reserve }
    ];
    onStart(values.map((pot) => ({ ...pot, limit: Math.max(Number(pot.value) || 0, 0), spent: 0 })), dayLabel.trim() || 'Minha semana', setup);
  };

  return (
    <div ref={dialogRef} tabIndex={-1} className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="card-pixel welcome-modal__card">
        <span className="welcome-modal__eyebrow">CONFIGURAR TURNO</span>
        {onClose && <button type="button" className="btn-retro" onClick={onClose}>Cancelar configuração</button>}
        <h1 id="welcome-title" className="pixel-title">Bem-vinda ao TURNO</h1>
        <p className="welcome-modal__lead">Seu dia não precisa caber em um modelo pronto. Vamos montar uma semana que tenha a ver com você.</p>
        <div className="welcome-guide">
          <div><b>⏱ Tempo</b><span>Veja o que cabe no seu dia.</span></div>
          <div><b>📚 Organização</b><span>Monte blocos, aulas e prioridades.</span></div>
          <div><b>💰 Finanças</b><span>Defina o semanal e acompanhe os gastos.</span></div>
          <div><b>🛌 Sono</b><span>Proteja horários de dormir e acordar.</span></div>
        </div>
        <form onSubmit={submit} className="welcome-form">
          <label>Nome deste turno
            <input value={dayLabel} onChange={(event) => setDayLabel(event.target.value)} />
          </label>
          <div className="welcome-form__grid welcome-form__grid--context">
            <label>Curso ou área (opcional)<input placeholder="Ex.: ADS, Direito..." value={setup.course} onChange={(event) => setSetup({ ...setup, course: event.target.value })} /></label>
            <label>Disciplina ou aula<input placeholder="Ex.: Estrutura de Dados" value={setup.className} onChange={(event) => setSetup({ ...setup, className: event.target.value })} /></label>
            <label>Horário da aula<input type="time" required value={setup.classTime} onChange={(event) => setSetup({ ...setup, classTime: event.target.value })} /></label>
          </div>
          <label className="welcome-check"><input type="checkbox" checked={setup.hasWork} onChange={(event) => setSetup({ ...setup, hasWork: event.target.checked })} /> Tenho estágio/trabalho fixo nesta rotina</label>
          {setup.hasWork && <div className="welcome-form__grid"><label>Nome<input value={setup.workTitle} onChange={(event) => setSetup({ ...setup, workTitle: event.target.value })} /></label><label>Horário<input type="time" required value={setup.workTime} onChange={(event) => setSetup({ ...setup, workTime: event.target.value })} /></label></div>}
          <p className="welcome-form__label">Seu ritmo de sono (você poderá ajustar depois)</p>
          <div className="welcome-form__grid"><label>Hora de dormir<input type="time" required value={setup.sleepTime} onChange={(event) => setSetup({ ...setup, sleepTime: event.target.value })} /></label><label>Hora de acordar<input type="time" required value={setup.wakeTime} onChange={(event) => setSetup({ ...setup, wakeTime: event.target.value })} /></label></div>
          <p className="welcome-form__label">Quanto você quer separar nesta semana?</p>
          <div className="welcome-form__grid">
            <label>Essenciais<input type="number" min="0" step="0.01" value={budget.essential} onChange={(event) => setBudget({ ...budget, essential: event.target.value })} /></label>
            <label>Lazer<input type="number" min="0" step="0.01" value={budget.flexible} onChange={(event) => setBudget({ ...budget, flexible: event.target.value })} /></label>
            <label>Reserva<input type="number" min="0" step="0.01" value={budget.reserve} onChange={(event) => setBudget({ ...budget, reserve: event.target.value })} /></label>
          </div>
          <small>Para alterar os limites depois, configure uma nova semana. Isso substitui os blocos e zera os gastos atuais. Nada aqui é uma obrigação.</small>
          <button className="btn-retro welcome-form__submit" type="submit">Começar meu turno →</button>
        </form>
      </div>
    </div>
  );
};
