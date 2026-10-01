import React, { useState } from 'react';
import { budgetPercent } from '../../state';
import { FinancePot } from '../../types';

interface FinancePotsProps {
  pots: FinancePot[];
  onAddExpense: (potId: 'essential' | 'flexible' | 'reserve', amount: number) => void;
  onRestartWeek: () => void;
}

export const FinancePots: React.FC<FinancePotsProps> = ({ pots, onAddExpense, onRestartWeek }) => {
  const [valueInput, setValueInput] = useState('');
  const [selectedPot, setSelectedPot] = useState<'essential' | 'flexible' | 'reserve'>('flexible');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(valueInput.replace(',', '.'));
    if (Number.isFinite(parsed) && parsed >= 0.01) {
      onAddExpense(selectedPot, parsed);
      setValueInput('');
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <h2 className="pixel-title" style={{ fontSize: '1.25rem', color: 'var(--gold-coin)' }}>
          Caixa da Semana
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Controle de margem sem conciliação bancária burocrática.
        </p>
        <button type="button" className="week-reset" onClick={onRestartWeek}>↻ Configurar uma nova semana</button>
      </div>

      {/* Os Três Potes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {pots.map(pot => {
          const percent = budgetPercent(pot.spent, pot.limit);

          return (
            <div key={pot.id} className="card-pixel" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: pot.color }}>
                  {pot.label}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  R$ {pot.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>/ R$ {pot.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </span>
              </div>

              <div style={{
                width: '100%',
                height: '8px',
                background: 'var(--bg-deep)',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid var(--surface-light)'
              }}>
                <div style={{
                  width: `${percent}%`,
                  height: '100%',
                  background: pot.color,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lançamento Rápido em 3 Passos (Valor -> Pote -> Registrar) */}
      <div className="card-pixel" style={{ padding: '14px' }}>
        <h3 style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '10px' }}>
          Registrar Gasto Rápido
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              background: 'var(--bg-deep)',
              border: '2px solid var(--surface-light)',
              borderRadius: '4px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>
              R$
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              aria-label="Valor do gasto"
              placeholder="0,00"
              value={valueInput}
              onChange={e => setValueInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'var(--bg-deep)',
                border: '2px solid var(--surface-light)',
                borderRadius: '4px',
                color: 'var(--text-main)',
                fontSize: '1rem',
                fontFamily: 'var(--font-sans)'
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
            {(['essential', 'flexible', 'reserve'] as const).map(pId => (
              <button
                type="button"
                key={pId}
                onClick={() => setSelectedPot(pId)}
                aria-pressed={selectedPot === pId}
                style={{
                  padding: '6px 4px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: selectedPot === pId ? '2px solid var(--text-main)' : '1px solid var(--surface-light)',
                  background: selectedPot === pId ? 'var(--surface-light)' : 'var(--bg-deep)',
                  color: selectedPot === pId ? 'var(--text-main)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {pId === 'essential' ? 'Essencial' : pId === 'flexible' ? 'Lazer' : 'Reserva'}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="btn-retro"
            style={{
              background: 'var(--gold-coin)',
              color: '#1A1823',
              padding: '10px',
              fontSize: '0.85rem',
              marginTop: '4px'
            }}
          >
            ✓ Salvar Gasto
          </button>
        </form>
      </div>
    </div>
  );
};
