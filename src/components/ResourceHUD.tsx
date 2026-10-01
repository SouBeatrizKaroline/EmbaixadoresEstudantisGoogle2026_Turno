import React from 'react';
import { TimeOfDay } from '../types';

interface ResourceHUDProps {
  timeOfDay: TimeOfDay;
  onTimeChange: (time: TimeOfDay) => void;
  ap: number;
  maxAp: number;
  flexibleBudget: number;
  onOpenRescue: () => void;
}

export const ResourceHUD: React.FC<ResourceHUDProps> = ({
  timeOfDay,
  onTimeChange,
  ap,
  maxAp,
  flexibleBudget,
  onOpenRescue
}) => {
  return (
    <header style={{
      padding: '12px 16px',
      background: '#201D2C',
      borderBottom: '2px solid var(--surface-light)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="pixel-title" style={{ fontSize: '1.4rem', color: 'var(--amber-warm)', lineHeight: 1 }}>
            TURNO
          </h1>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            Seu dia em blocos
          </p>
        </div>

        <button 
          onClick={onOpenRescue}
          className="btn-retro"
          style={{
            background: 'var(--surface-light)',
            color: 'var(--text-main)',
            fontSize: '0.72rem',
            padding: '5px 9px'
          }}
          aria-label="Abrir protocolo de resgate Tudo Mudou"
        >
          🧭 Tudo Mudou
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.9rem' }}>⚡</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--amber-warm)' }}>
              {ap}<span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>/{maxAp} AP</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.9rem' }}>💰</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-coin)' }}>
              R$ {flexibleBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>margem</span>
            </span>
          </div>
        </div>

        {/* Chaveador de teste para simular o período do dia e iluminação */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-deep)',
          padding: '2px',
          borderRadius: '4px',
          border: '1px solid var(--surface-light)'
        }} role="group" aria-label="Simulador de período do dia">
          {(['morning', 'afternoon', 'night'] as TimeOfDay[]).map(period => (
            <button
              key={period}
              onClick={() => onTimeChange(period)}
              style={{
                background: timeOfDay === period ? 'var(--amber-warm)' : 'transparent',
                color: timeOfDay === period ? '#1A1823' : 'var(--text-muted)',
                border: 'none',
                padding: '2px 6px',
                fontSize: '0.62rem',
                fontWeight: 700,
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              {period === 'morning' ? 'Manhã' : period === 'afternoon' ? 'Tarde' : 'Noite'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
