import type { BossTopic, FinancePot, Task, TimeOfDay } from './types.ts';

export const stateKey = 'turno-state-v2';
export interface SavedState {
  timeOfDay: TimeOfDay;
  ap: number;
  tasks: Task[];
  topics: BossTopic[];
  pots: FinancePot[];
  dayLabel: string;
  sleepPlan: { bedtime: string; wakeTime: string };
  lastSleep?: { bedtime: string; wakeTime: string; quality: string; duration: number };
  focusMinutes: number;
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isAmount = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
export const isTime = (value: unknown): value is string => typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
const isTask = (value: unknown): value is Task => isObject(value) && isText(value.id) && isText(value.title) && isTime(value.timeLabel)
  && ['morning', 'afternoon', 'night', 'dawn'].includes(String(value.period)) && ['pending', 'completed', 'postponed'].includes(String(value.status))
  && (value.isFixed === undefined || typeof value.isFixed === 'boolean') && (value.focusTopic === undefined || isText(value.focusTopic))
  && (value.dueDate === undefined || (typeof value.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.dueDate) && !Number.isNaN(Date.parse(value.dueDate))));
const isTopic = (value: unknown): value is BossTopic => isObject(value) && isText(value.id) && isText(value.title) && ['nebuloso', 'razoavel', 'firme'].includes(String(value.familiarity));
const isPot = (value: unknown): value is FinancePot => isObject(value) && ['essential', 'flexible', 'reserve'].includes(String(value.id)) && isText(value.label) && isText(value.color) && isAmount(value.spent) && isAmount(value.limit);
const uniqueIds = (items: { id: string }[]) => new Set(items.map(item => item.id)).size === items.length;

export function parseSavedState(raw: string): Partial<SavedState> {
  const value: unknown = JSON.parse(raw);
  if (!isObject(value)) throw new Error('Invalid saved state');
  const state: Partial<SavedState> = {};
  if (['morning', 'afternoon', 'night'].includes(String(value.timeOfDay))) state.timeOfDay = value.timeOfDay as TimeOfDay;
  if (isAmount(value.ap)) state.ap = Math.min(value.ap, 80);
  if (Array.isArray(value.tasks) && value.tasks.every(isTask) && uniqueIds(value.tasks)) state.tasks = value.tasks;
  if (Array.isArray(value.topics) && value.topics.every(isTopic) && uniqueIds(value.topics)) state.topics = value.topics;
  if (Array.isArray(value.pots) && value.pots.length === 3 && value.pots.every(isPot) && uniqueIds(value.pots)) state.pots = value.pots;
  if (isText(value.dayLabel)) state.dayLabel = value.dayLabel;
  if (isObject(value.sleepPlan) && isTime(value.sleepPlan.bedtime) && isTime(value.sleepPlan.wakeTime)) state.sleepPlan = { bedtime: value.sleepPlan.bedtime, wakeTime: value.sleepPlan.wakeTime };
  if (isObject(value.lastSleep) && isTime(value.lastSleep.bedtime) && isTime(value.lastSleep.wakeTime) && ['restful', 'mixed', 'poor'].includes(String(value.lastSleep.quality)) && isAmount(value.lastSleep.duration) && value.lastSleep.duration <= 1440) state.lastSleep = value.lastSleep as SavedState['lastSleep'];
  if (isAmount(value.focusMinutes)) state.focusMinutes = value.focusMinutes;
  return state;
}

export function readStorage(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function writeStorage(key: string, value: string): boolean {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}

export function periodForTime(time: string): Task['period'] {
  if (time < '06:00' || time >= '23:00') return 'dawn';
  if (time < '12:00') return 'morning';
  return time < '18:00' ? 'afternoon' : 'night';
}

export function linkedFocusTask(tasks: Task[], topic: string): Task | undefined {
  return tasks.find(task => task.status === 'pending' && (task.focusTopic === topic || task.title === topic || task.title === `Foco: ${topic}`));
}

export function completeFocusTask(tasks: Task[], id?: string): Task[] {
  return tasks.map(task => task.id === id && task.status === 'pending' ? { ...task, status: 'completed' } : task);
}

export function remainingSeconds(deadline: number, now: number): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

export function elapsedMinutes(duration: number, secondsLeft: number): number {
  return Math.floor(Math.max(0, duration * 60 - secondsLeft) / 60);
}

export function addMoney(spent: number, amount: number): number {
  return Math.round((spent * 100) + (amount * 100)) / 100;
}

export function budgetPercent(spent: number, limit: number): number {
  return limit > 0 ? Math.min(Math.round(spent / limit * 100), 100) : spent > 0 ? 100 : 0;
}

export function sleepDuration(bedtime: string, wakeTime: string): number | undefined {
  if (!isTime(bedtime) || !isTime(wakeTime)) return undefined;
  const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
  return (minutes(wakeTime) - minutes(bedtime) + 1440) % 1440;
}
