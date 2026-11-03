import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseDateTime,
  calculateDurationMinutes,
  formatDuration,
  isSlaBreached,
  getRemainingSlaMinutes,
  formatSlaCountdown,
  formatTicketId,
  formatProblemId,
  getPriorityFromSeverity,
} from './calculations';

test('parseDateTime correctly handles standard ISO/time strings', () => {
  const d = parseDateTime('2026-10-31', '14:30:00');
  assert.ok(d !== null);
  assert.equal(d?.getFullYear(), 2026);
  assert.equal(d?.getMonth(), 9); // October is month 9 in 0-indexed JS
  assert.equal(d?.getDate(), 31);
});

test('calculateDurationMinutes returns correct diff between start and end', () => {
  const diff = calculateDurationMinutes('2026-10-31', '10:00:00', '2026-10-31', '12:30:00');
  assert.equal(diff, 150);
});

test('calculateDurationMinutes handles missing end date by using reference now', () => {
  const referenceNow = new Date('2026-10-31T11:15:00');
  const diff = calculateDurationMinutes('2026-10-31', '10:00:00', '', '', referenceNow);
  assert.equal(diff, 75);
});

test('formatDuration formats days, hours, and minutes gracefully', () => {
  assert.equal(formatDuration(45), '45m');
  assert.equal(formatDuration(150), '2h 30m');
  assert.equal(formatDuration(1440 + 120 + 15), '1d 2h 15m');
  assert.equal(formatDuration(0), '0m');
});

test('SLA breach checks and countdown', () => {
  // Critical SLA is 60m
  assert.equal(isSlaBreached(59, 'Critical'), false);
  assert.equal(isSlaBreached(61, 'Critical'), true);
  assert.equal(getRemainingSlaMinutes(45, 'Critical'), 15);

  const countdownOk = formatSlaCountdown(45, 'Critical');
  assert.equal(countdownOk.breached, false);
  assert.equal(countdownOk.text, '15m remaining');

  const countdownBreached = formatSlaCountdown(75, 'Critical');
  assert.equal(countdownBreached.breached, true);
  assert.equal(countdownBreached.text, 'Breached by 15m');
});

test('ID generators produce proper zero-padded strings', () => {
  assert.equal(formatTicketId(1), 'DEMO-INC-0001');
  assert.equal(formatTicketId(42), 'DEMO-INC-0042');
  assert.equal(formatProblemId(5), 'DEMO-P-2610005');
});

test('Severity to Priority mapping', () => {
  assert.equal(getPriorityFromSeverity('Critical'), 'P1');
  assert.equal(getPriorityFromSeverity('High'), 'P2');
  assert.equal(getPriorityFromSeverity('Medium'), 'P3');
  assert.equal(getPriorityFromSeverity('Low'), 'P4');
});
