import React, { useEffect, useState, useRef } from 'react';
import { TimeOfDay, ActiveTab, Task, BossTopic, FinancePot, TopicFamiliarity } from './types';
import { ResourceHUD } from './components/ResourceHUD';
import { Room } from './components/room/Room';
import { DayPlanner } from './components/planner/DayPlanner';
import { BossArena } from './components/boss/BossArena';
import { FocusSession } from './components/focus/FocusSession';
import { FinancePots } from './components/finance/FinancePots';
import { RescueModal } from './components/RescueModal';
import { BottomNavigation } from './components/BottomNavigation';
import { RestModal } from './components/RestModal';
import { StarterSetup, WelcomeModal } from './components/WelcomeModal';
import { stateKey, parseSavedState, readStorage, writeStorage, periodForTime, linkedFocusTask, completeFocusTask, addMoney } from './state';

export const App: React.FC = () => {
  // Estado Temporal e Navegação
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [activeTab, setActiveTab] = useState<ActiveTab>('room');
  const [isRescueOpen, setIsRescueOpen] = useState(false);
  const [isRestOpen, setIsRestOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => !readStorage('turno-onboarding-v1'));
  const [focusTopic, setFocusTopic] = useState<string>('Árvores Binárias');
  const [focusTaskId, setFocusTaskId] = useState<string>();
  const [dayLabel, setDayLabel] = useState('Meu dia');
  const [sleepPlan, setSleepPlan] = useState({ bedtime: '23:00', wakeTime: '07:00' });
  const [lastSleep, setLastSleep] = useState<{ bedtime: string; wakeTime: string; quality: string; duration: number }>();
  const [focusMinutes, setFocusMinutes] = useState(0);

  // Recursos Vitais
  const [ap, setAp] = useState(65);
  const maxAp = 80;

  // Estado das Tarefas dos 4 Blocos
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Aula de Estrutura de Dados', timeLabel: '08:00', period: 'morning', status: 'completed' },
    { id: '2', title: 'Revisar listas encadeadas', timeLabel: '10:30', period: 'morning', status: 'completed' },
    { id: '3', title: 'Estágio Remoto', timeLabel: '14:00', period: 'afternoon', status: 'pending' },
    { id: '4', title: 'Foco: Árvores Binárias', timeLabel: '17:30', period: 'afternoon', status: 'pending' },
    { id: '5', title: 'Jantar com calma', timeLabel: '19:30', period: 'night', status: 'pending' },
    { id: '6', title: 'Exercícios práticos', timeLabel: '20:30', period: 'night', status: 'pending' },
    { id: '7', title: 'Recolhimento para o sono', timeLabel: '23:00', period: 'dawn', status: 'pending' }
  ]);

  // Estado dos Tópicos do Boss
  const [topics, setTopics] = useState<BossTopic[]>([
    { id: 't1', title: 'Listas Encadeadas', familiarity: 'firme' },
    { id: 't2', title: 'Pilhas e Filas', familiarity: 'razoavel' },
    { id: 't3', title: 'Árvores Binárias', familiarity: 'nebuloso' }
  ]);

  // Estado dos 3 Potes Financeiros
  const [pots, setPots] = useState<FinancePot[]>([
    { id: 'essential', label: 'Essenciais', spent: 0, limit: 180, color: 'var(--slate-focus)' },
    { id: 'flexible', label: 'Lazer / Flexível', spent: 0, limit: 70, color: 'var(--amber-warm)' },
    { id: 'reserve', label: 'Reserva de Emergência', spent: 0, limit: 50, color: 'var(--sage-calm)' }
  ]);
  const [toast, setToast] = useState('');
  const [undo, setUndo] = useState<(() => void) | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const saved = readStorage(stateKey) || readStorage('turno-state-v1');
    try {
      const state = saved ? parseSavedState(saved) : {};
      if (state.timeOfDay) setTimeOfDay(state.timeOfDay);
      if (typeof state.ap === 'number') setAp(state.ap);
      if (state.tasks) setTasks(state.tasks);
      if (state.topics) setTopics(state.topics);
      if (state.pots) setPots(state.pots);
      if (state.dayLabel) setDayLabel(state.dayLabel);
      if (state.sleepPlan) setSleepPlan(state.sleepPlan);
      if (state.lastSleep) setLastSleep(state.lastSleep);
      if (typeof state.focusMinutes === 'number') setFocusMinutes(state.focusMinutes);
    } catch {
      // Invalid stored data falls back to defaults; hydration must still finish.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStorageUnavailable(!writeStorage(stateKey, JSON.stringify({ timeOfDay, ap, tasks, topics, pots, dayLabel, sleepPlan, lastSleep, focusMinutes })));
  }, [hydrated, timeOfDay, ap, tasks, topics, pots, dayLabel, sleepPlan, lastSleep, focusMinutes]);

  const announce = (message: string) => {
    setUndo(null);
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => { setToast(''); setUndo(null); }, 8000);
  };

  // Ações de Tarefas
  const handleCompleteTask = (id: string) => {
    const previous = tasks.find(task => task.id === id);
    if (!previous) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    announce('Bloco concluído. Se foi sem querer, você pode desfazer.');
    setUndo(() => () => setTasks(current => current.map(task => task.id === id ? previous : task)));
  };

  const handlePostponeTask = (id: string) => {
    const task = tasks.find(item => item.id === id);
    if (!task || task.isFixed) return;
    const availableMargin = tasks.filter(item => item.status === 'pending' && !item.isFixed && item.id !== id).length;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'postponed' } : t));
    announce(`${task?.title || 'Bloco'} reorganizado. Custo de oportunidade: ${availableMargin ? `${availableMargin} margem(ns) livre(s) disponível(is)` : 'a próxima escolha ocupará outro espaço'}.`);
    setUndo(() => () => setTasks(current => current.map(item => item.id === id ? task : item)));
  };

  const handleRemoveTask = (id: string) => {
    const previous = tasks.find(task => task.id === id);
    const index = tasks.findIndex(task => task.id === id);
    if (!previous || previous.isFixed) return;
    setTasks(prev => prev.filter(t => t.id !== id));
    announce('Bloco removido. Se foi sem querer, você pode desfazer.');
    setUndo(() => () => setTasks(current => [...current.slice(0, index), previous, ...current.slice(index)]));
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'status'>) => {
    setTasks(prev => [...prev, { ...task, id: 'custom-' + crypto.randomUUID(), status: 'pending' }]);
    announce('Novo bloco adicionado ao seu turno.');
  };

  const handleEditTask = (id: string, changes: Partial<Omit<Task, 'id' | 'status'>>) => {
    setTasks(previous => previous.map(task => task.id === id ? { ...task, ...changes } : task));
    announce('Bloco atualizado.');
  };

  // Ações de Foco
  const handleStartFocus = (topicTitle: string = 'Árvores Binárias', taskTitle?: string) => {
    setFocusTopic(topicTitle);
    setFocusTaskId((taskTitle ? tasks.find(task => task.title === taskTitle && task.status === 'pending') : linkedFocusTask(tasks, topicTitle))?.id);
    setActiveTab('focus');
  };

  const handleAddTopic = (title: string) => {
    setTopics(prev => [...prev, { id: 'topic-' + crypto.randomUUID(), title, familiarity: 'nebuloso' }]);
    announce('Novo desafio cadastrado como Travado. Você pode começar pelo foco.');
  };

  const handleRecover = (amount: number, message: string) => {
    setAp(prev => Math.min(prev + amount, maxAp));
    setIsRestOpen(false);
    announce(message);
  };

  const handleStartWeek = (newPots: FinancePot[], newDayLabel: string, setup: StarterSetup) => {
    setPots(newPots);
    setDayLabel(newDayLabel);
    setSleepPlan({ bedtime: setup.sleepTime, wakeTime: setup.wakeTime });
    const starterTasks: Task[] = [
      ...(setup.className ? [{ id: 'context-class', title: setup.className, timeLabel: setup.classTime, period: periodForTime(setup.classTime), isFixed: true, status: 'pending' as const }] : []),
      ...(setup.hasWork ? [{ id: 'context-work', title: setup.workTitle || 'Trabalho', timeLabel: setup.workTime, period: periodForTime(setup.workTime), isFixed: true, status: 'pending' as const }] : []),
      { id: 'context-rest', title: 'Higiene do sono: desacelerar', timeLabel: setup.sleepTime, period: periodForTime(setup.sleepTime), status: 'pending' }
    ];
    setTasks(starterTasks);
    writeStorage('turno-onboarding-v1', 'done');
    setLastSleep(undefined);
    setIsWelcomeOpen(false);
    announce('Seu turno começou. Você pode adaptar tudo ao longo da semana.');
  };

  const handleFinishFocus = (result: TopicFamiliarity, minutes: number) => {
    setFocusMinutes(prev => prev + minutes);
    setTopics(prev => prev.map(t => t.title === focusTopic ? { ...t, familiarity: result } : t));
    // Conclui também a tarefa de estudo caso exista na lista
    setTasks(prev => completeFocusTask(prev, focusTaskId));
    setActiveTab('boss');
    announce(`Check-in salvo. ${minutes} min de foco registrados.`);
  };

  const handleRecordSleep = (record: { bedtime: string; wakeTime: string; quality: string; duration: number }) => {
    setLastSleep(record);
    setIsRestOpen(false);
    announce(`Noite registrada: ${Math.floor(record.duration / 60)}h ${record.duration % 60}min. Sem punição, só contexto.`);
  };

  // Ações Financeiras
  const handleAddExpense = (potId: 'essential' | 'flexible' | 'reserve', amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setPots(prev => prev.map(p => p.id === potId ? { ...p, spent: addMoney(p.spent, amount) } : p));
    announce('Gasto registrado no pote escolhido.');
  };

  // Protocolo de Resgate "Tudo Mudou"
  const handleApplyRescue = () => {
    setTasks(prev => prev.map(t => {
      if (t.period === 'afternoon' && !t.isFixed && t.status === 'pending') {
        return { ...t, status: 'postponed' };
      }
      return t;
    }));
    setAp(prev => Math.min(prev + 15, maxAp));
    setIsRescueOpen(false);
    announce('Dia reorganizado. O que é fixo continua protegido.');
  };

  const flexibleBudgetRemaining = (pots.find(p => p.id === 'flexible')?.limit || 0) - (pots.find(p => p.id === 'flexible')?.spent || 0);
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const dayProgress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const roomState = ap < 35 ? 'casulo' : tasks.some(task => task.status === 'postponed') ? 'pausa' : 'ritmo';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {storageUnavailable && <p role="alert">O navegador não permitiu salvar seu progresso. Os dados desta sessão podem se perder ao fechar ou recarregar a página.</p>}
      {/* Topo / HUD */}
      <ResourceHUD
        timeOfDay={timeOfDay}
        onTimeChange={setTimeOfDay}
        ap={ap}
        maxAp={maxAp}
        flexibleBudget={Math.max(flexibleBudgetRemaining, 0)}
        onOpenRescue={() => setIsRescueOpen(true)}
      />

      {/* Roteador Visual da Vertical Slice */}
      <main style={{ flex: 1, paddingBottom: '16px' }}>
        {activeTab === 'room' && (
          <Room
            timeOfDay={timeOfDay}
            onNavigate={tab => setActiveTab(tab)}
            onStartFocus={() => handleStartFocus('Árvores Binárias')}
            dayProgress={dayProgress}
            dayLabel={dayLabel}
            onOpenRest={() => setIsRestOpen(true)}
            roomState={roomState}
            tasks={tasks}
          />
        )}

        {activeTab === 'planner' && (
          <DayPlanner
            tasks={tasks}
            onCompleteTask={handleCompleteTask}
            onPostponeTask={handlePostponeTask}
            onRemoveTask={handleRemoveTask}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
          />
        )}

        {activeTab === 'boss' && (
          <BossArena
            topics={topics}
            onStartFocus={handleStartFocus}
            onAddTopic={handleAddTopic}
          />
        )}

        <div hidden={activeTab !== 'focus'}>
          <FocusSession
            key={`${focusTopic}:${focusTaskId || ''}`}
            isActive={activeTab === 'focus'}
            topicTitle={focusTopic}
            linkedTaskTitle={tasks.find(task => task.id === focusTaskId)?.title}
            onFinish={handleFinishFocus}
            onCancel={() => setActiveTab('boss')}
          />
        </div>

        {activeTab === 'finance' && (
          <FinancePots
            pots={pots}
            onAddExpense={handleAddExpense}
            onRestartWeek={() => setIsWelcomeOpen(true)}
          />
        )}
      </main>

      {/* Modal de Reorganização Tática */}
      <RescueModal
        isOpen={isRescueOpen}
        onClose={() => setIsRescueOpen(false)}
        onApplyRescue={handleApplyRescue}
      />
      <RestModal isOpen={isRestOpen} onClose={() => setIsRestOpen(false)} onRecover={handleRecover} sleepPlan={sleepPlan} lastSleep={lastSleep} onRecordSleep={handleRecordSleep} />
      {isWelcomeOpen && <WelcomeModal onStart={handleStartWeek} onClose={readStorage('turno-onboarding-v1') ? () => setIsWelcomeOpen(false) : undefined} />}

      {/* Barra de Navegação Inferior Acessível */}
      <BottomNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />
      <div className={`toast ${toast ? 'toast--visible' : ''}`} role="status" aria-live="polite">
        {toast}
        {undo && toast && <button className="toast__undo" onClick={() => { undo(); setUndo(null); setToast('Ação desfeita.'); }}>Desfazer</button>}
      </div>
    </div>
  );
};
