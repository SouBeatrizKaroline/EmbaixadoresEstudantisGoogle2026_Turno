import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSavedState, readStorage, writeStorage, periodForTime, linkedFocusTask, completeFocusTask, remainingSeconds, elapsedMinutes, addMoney, budgetPercent, sleepDuration } from '../src/state.ts';

const task = (id, title, changes = {}) => ({ id, title, timeLabel: '14:00', period: 'afternoon', status: 'pending', ...changes });

test('reload preserves explicitly fixed commitments, including onboarding IDs', () => {
  const tasks = [task('context-work', 'Estágio', { isFixed: true }), task('1', 'Aula', { isFixed: true })];
  assert.deepEqual(parseSavedState(JSON.stringify({ tasks })).tasks, tasks);
});

test('malformed saved fields cannot crash task rendering', () => {
  for (const tasks of [null, {}, [null], [task(123, 'Aula')], [task('1', 'Aula', { period: 'invalid' })]]) {
    assert.equal(parseSavedState(JSON.stringify({ tasks, dayLabel: 'Preservado' })).tasks, undefined);
    assert.equal(parseSavedState(JSON.stringify({ tasks, dayLabel: 'Preservado' })).dayLabel, 'Preservado');
  }
  assert.throws(() => parseSavedState('null'));
  assert.throws(() => parseSavedState('{'));
});

test('duplicate IDs and incomplete finance pots are rejected', () => {
  assert.equal(parseSavedState(JSON.stringify({ tasks: [task('1', 'A'), task('1', 'B')] })).tasks, undefined);
  assert.equal(parseSavedState('{"pots":[]}').pots, undefined);
});

test('empty saved lists remain empty and old partial states remain usable', () => {
  assert.deepEqual(parseSavedState('{"tasks":[],"topics":[],"ap":999}'), { tasks: [], topics: [], ap: 80 });
});

test('unavailable storage never throws on reading or writing', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Blocked'); } });
  try { assert.equal(readStorage('state'), null); assert.equal(writeStorage('state', '{}'), false); }
  finally { if (original) Object.defineProperty(globalThis, 'localStorage', original); else delete globalThis.localStorage; }
});

test('focus finishes only the explicitly linked pending task', () => {
  const tasks = [task('1', 'Foco: Árvores'), task('2', 'Foco: Árvores'), task('3', 'Não estudar Árvores'), task('4', 'Árvores', { status: 'postponed' })];
  assert.equal(linkedFocusTask(tasks, 'Árvores').id, '1');
  assert.deepEqual(completeFocusTask(tasks, '1').map(item => item.status), ['completed', 'pending', 'pending', 'postponed']);
  assert.deepEqual(completeFocusTask(tasks), tasks);
  assert.deepEqual(completeFocusTask(tasks, '4'), tasks);
  assert.equal(linkedFocusTask([tasks[2]], 'Árvores'), undefined);
});

test('timer catches up after a delayed callback without going negative', () => {
  assert.equal(remainingSeconds(25000, 10000), 15);
  assert.equal(remainingSeconds(25000, 10001), 15);
  assert.equal(remainingSeconds(25000, 30000), 0);
});

test('early finish records only whole minutes actually studied', () => {
  assert.equal(elapsedMinutes(25, 1500), 0);
  assert.equal(elapsedMinutes(25, 1499), 0);
  assert.equal(elapsedMinutes(25, 1380), 2);
  assert.equal(elapsedMinutes(25, 0), 25);
});

test('time periods include night and dawn boundaries', () => {
  for (const [time, period] of [['05:59', 'dawn'], ['06:00', 'morning'], ['11:59', 'morning'], ['12:00', 'afternoon'], ['17:59', 'afternoon'], ['18:00', 'night'], ['22:59', 'night'], ['23:00', 'dawn']]) assert.equal(periodForTime(time), period);
});

test('money uses cent rounding and zero budgets never produce NaN', () => {
  assert.equal(addMoney(0.1, 0.2), 0.3);
  assert.equal(addMoney(0.3, 0.1), 0.4);
  assert.equal(budgetPercent(0, 0), 0);
  assert.equal(budgetPercent(10, 0), 100);
  assert.equal(budgetPercent(20, 10), 100);
});

test('sleep handles overnight, empty times and equal times', () => {
  assert.equal(sleepDuration('23:00', '07:00'), 480);
  assert.equal(sleepDuration('07:00', '07:00'), 0);
  assert.equal(sleepDuration('', '07:00'), undefined);
  assert.equal(sleepDuration('23:00', '25:00'), undefined);
});
