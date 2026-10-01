import { useDialogFocus } from '../useDialogFocus';
import React from 'react';

interface RescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRescue: () => void;
}

export const RescueModal: React.FC<RescueModalProps> = ({
  isOpen,
  onClose,
  onApplyRescue
}) => {
  const dialogRef = useDialogFocus(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rescue-title"
      style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(10, 8, 16, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 100
    }}>
      <div className="card-pixel" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '18px',
        background: '#241F33',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 id="rescue-title" className="pixel-title" style={{ fontSize: '1.15rem', color: 'var(--amber-warm)' }}>
            🧭 Protocolo: Tudo Mudou
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar Tudo Mudou"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.1rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
          Rotinas quebram e dias difíceis acontecem. Vamos podar o que não é urgente para proteger sua energia de hoje.
        </p>

        <div style={{
          background: 'var(--bg-deep)',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid var(--surface-light)',
          fontSize: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div>✓ Adiar tarefas secundárias da tarde sem culpa</div>
          <div>✓ Manter compromissos fixos e prazos informados</div>
          <div>✓ Registrar uma pausa no ritmo do dia (+15 AP)</div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <button
            onClick={onClose}
            className="btn-retro"
            style={{ flex: 1, background: 'var(--surface-light)', color: 'var(--text-main)', padding: '8px', fontSize: '0.78rem' }}
          >
            Voltar
          </button>

          <button
            onClick={onApplyRescue}
            className="btn-retro"
            style={{ flex: 2, background: 'var(--amber-warm)', color: '#1A1823', padding: '8px', fontSize: '0.78rem' }}
          >
            Reorganizar meu Dia
          </button>
        </div>
      </div>
    </div>
  );
};
