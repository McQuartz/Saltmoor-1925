// Regel-Tests: kleine handgebaute Index-Bilder mit erwarteter Ausgabe.
// '.' transparent, 'o' Umriss, '0'..'3' Rampenstufe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fromRows, toRows } from '../core/indexed.js';
import { ruleOrphans, ruleStaircase, ruleBanding } from '../core/cleanup.js';
import { outerOutline } from '../core/outline.js';

const run = (rule, rows) => toRows(rule(fromRows(rows)));

test('Einzelpixel: Sporn wird entfernt', () => {
  assert.deepEqual(run(ruleOrphans, [
    '......',
    '.2222.',
    '.22222',
    '.2222.',
  ]), [
    '......',
    '.2222.',
    '.2222.',
    '.2222.',
  ]);
});

test('Einzelpixel: Kerbe wird gefüllt', () => {
  assert.deepEqual(run(ruleOrphans, [
    '.222.',
    '.2.2.',
    '.222.',
  ]), [
    '.222.',
    '.222.',
    '.222.',
  ]);
});

test('Einzelpixel: einzelner Ton wird dem Umfeld angepasst', () => {
  assert.deepEqual(run(ruleOrphans, [
    '11111',
    '11311',
    '11111',
  ]), [
    '11111',
    '11111',
    '11111',
  ]);
});

test('Einzelpixel: saubere Fläche bleibt unverändert', () => {
  const rows = ['.....', '.112.', '.112.', '.....'];
  assert.deepEqual(run(ruleOrphans, rows), rows);
});

test('Treppen: Stufenfolge 4,1,4 an linker Kante wird 3,2,4', () => {
  assert.deepEqual(run(ruleStaircase, [
    '.1111111',
    '.1111111',
    '.1111111',
    '.1111111',
    '..111111',
    '...11111',
    '...11111',
    '...11111',
    '...11111',
  ]), [
    '.1111111',
    '.1111111',
    '.1111111',
    '..111111',
    '..111111',
    '...11111',
    '...11111',
    '...11111',
    '...11111',
  ]);
});

test('Treppen: gleichmäßige Diagonale bleibt unverändert', () => {
  const rows = [
    '...1111',
    '..11111',
    '.111111',
    '1111111',
  ];
  assert.deepEqual(run(ruleStaircase, rows), rows);
});

test('Banding: 1 Pixel breiter Zwischenton zwischen breiten Bändern verschwindet', () => {
  assert.deepEqual(run(ruleBanding, [
    '000122',
    '000122',
    '000122',
  ]), [
    '000022',
    '000022',
    '000022',
  ]);
});

test('Banding: Verlauf aus lauter 1-Pixel-Stufen bleibt', () => {
  const rows = ['00123', '00123', '00123'];
  assert.deepEqual(run(ruleBanding, rows), rows);
});

test('Banding: breite Tonstufen bleiben', () => {
  const rows = ['0011', '0011', '0011'];
  assert.deepEqual(run(ruleBanding, rows), rows);
});

test('Außenumriss: transparente Nachbarn werden Umriss', () => {
  assert.deepEqual(run(outerOutline, [
    '.....',
    '..2..',
    '.....',
  ]), [
    '..o..',
    '.o2o.',
    '..o..',
  ]);
});
