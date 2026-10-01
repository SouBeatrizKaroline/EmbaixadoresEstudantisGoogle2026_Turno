import React, { useState } from 'react';
import { BossTopic } from '../../types';

interface BossArenaProps {
  topics: BossTopic[];
  onStartFocus: (topicTitle: string) => void;
  onAddTopic: (title: string) => void;
}

export const BossArena: React.FC<BossArenaProps> = ({ topics, onStartFocus, onAddTopic }) => {
  const [newTopic, setNewTopic] = useState('');

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <span style={{ fontSize: '0.7rem', color: 'var(--rose-alert)', fontWeight: 700, textTransform: 'uppercase' }}>
          Desafio da Semana
        </span>
        <h2 className="pixel-title" style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
          O Enigma de Estrutura de Dados
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          ⏳ Registre um prazo real nos seus blocos quando fizer sentido
        </p>
      </div>

      {/* Visual Pixel Art do Enigma (Monumento que se decifra) */}
      <div className="card-pixel" style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #2A213B 0%, #1A1823 100%)'
      }}>
        <svg
          viewBox="0 0 100 90"
          style={{ width: '120px', height: '110px', shapeRendering: 'crispEdges' }}
          role="img"
          aria-label="Monumento enigmático de pedra com runas luminosas"
        >
          {/* Base de pedra escura */}
          <polygon points="50,10 80,35 70,80 30,80 20,35" fill="#3D3452" stroke="#121017" strokeWidth="2" />
          {/* Facetas internas */}
          <polygon points="50,10 50,45 20,35" fill="#4B4163" />
          <polygon points="50,10 80,35 50,45" fill="#584D74" />
          <polygon points="50,45 70,80 30,80" fill="#342B47" />

          {/* O monumento reage sem transformar familiaridade em medida precisa. */}
          <line x1="50" y1="15" x2="50" y2="40" stroke="var(--amber-warm)" strokeWidth="2" />
          <line x1="50" y1="40" x2="65" y2="60" stroke="var(--gold-coin)" strokeWidth="2" />
          <line x1="50" y1="40" x2="35" y2="60" stroke="var(--sage-calm)" strokeWidth="2" />

          {/* Núcleo de conhecimento */}
          <circle cx="50" cy="42" r="6" fill="var(--amber-warm)" />
        </svg>

        <p style={{ width: '100%', marginTop: '12px', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          O cenário acompanha seu registro, sem transformar familiaridade em porcentagem ou previsão.
        </p>
      </div>

      {/* Lista de Tópicos e Maestria */}
      <div className="card-pixel" style={{ padding: '12px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>
          Tópicos Cadastrados
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {topics.map(topic => {
            const badgeColor = {
              firme: 'var(--sage-calm)',
              razoavel: 'var(--amber-warm)',
              nebuloso: 'var(--rose-alert)'
            }[topic.familiarity];

            const badgeLabel = {
              firme: '●●● Firme',
              razoavel: '●●○ Fluindo',
              nebuloso: '●○○ Travado'
            }[topic.familiarity];

            return (
              <div
                key={topic.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-deep)',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--surface-light)'
                }}
              >
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>{topic.title}</p>
                  <span style={{ fontSize: '0.68rem', color: badgeColor, fontWeight: 700 }}>
                    {badgeLabel}
                  </span>
                </div>

                <button
                  onClick={() => onStartFocus(topic.title)}
                  className="btn-retro"
                  style={{
                    background: topic.familiarity === 'nebuloso' ? 'var(--amber-warm)' : 'var(--surface-light)',
                    color: topic.familiarity === 'nebuloso' ? '#1A1823' : 'var(--text-main)',
                    fontSize: '0.72rem',
                    padding: '5px 8px'
                  }}
                >
                  Estudar ⚡
                </button>
              </div>
            );
          })}
        </div>
        <form className="topic-adder" onSubmit={(event) => {
          event.preventDefault();
          if (!newTopic.trim()) return;
          onAddTopic(newTopic.trim());
          setNewTopic('');
        }}>
          <label htmlFor="new-topic">Adicionar um desafio ou tema da sua realidade</label>
          <div>
            <input id="new-topic" value={newTopic} onChange={(event) => setNewTopic(event.target.value)} placeholder="Ex.: prova, TCC, entrevista..." />
            <button type="submit" className="btn-retro">＋ Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
