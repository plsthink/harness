'use strict';

// Behavior tests for todo-cli core ops, driven through the public interface
// (the exported functions + run). Storage is exercised against a temp file via
// $TODO_FILE so the real ~/.todo-cli.json is never touched.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { load, save, add, done, remove, clearDone, format, run, storePath } = require('../todo.js');

function tmpFile() {
  return path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'todo-')), 'store.json');
}

test('add assigns incrementing ids and starts not done', () => {
  const tasks = [];
  assert.equal(add(tasks, 'first'), 1);
  assert.equal(add(tasks, 'second'), 2);
  assert.deepEqual(tasks[0], { id: 1, text: 'first', done: false });
});

test('add rejects empty text', () => {
  assert.throws(() => add([], ''), /text required/);
});

test('done marks the matching task and rejects unknown ids', () => {
  const tasks = [{ id: 1, text: 'x', done: false }];
  done(tasks, 1);
  assert.equal(tasks[0].done, true);
  assert.throws(() => done(tasks, 99), /no task #99/);
});

test('remove deletes the matching task and rejects unknown ids', () => {
  const tasks = [{ id: 1, text: 'x', done: false }];
  remove(tasks, 1);
  assert.equal(tasks.length, 0);
  assert.throws(() => remove([], 5), /no task #5/);
});

test('format renders an empty list and a populated one', () => {
  assert.equal(format([]), '(no tasks)');
  assert.equal(
    format([{ id: 1, text: 'a', done: true }, { id: 2, text: 'b', done: false }]),
    '1. [x] a\n2. [ ] b'
  );
});

test('load returns [] for a missing or empty store, and round-trips via save', () => {
  const file = tmpFile();
  assert.deepEqual(load(file), []); // ENOENT
  save(file, []);
  assert.deepEqual(load(file), []); // empty array, not a parse crash
  const tasks = [{ id: 1, text: 'persisted', done: false }];
  save(file, tasks);
  assert.deepEqual(load(file), tasks);
});

test('run dispatches add/list/done/rm against a store and rejects unknown commands', () => {
  const file = tmpFile();
  assert.equal(run(['add', 'buy', 'milk'], file), 'added #1');
  assert.equal(run(['list'], file), '1. [ ] buy milk');
  assert.equal(run(['done', '1'], file), 'done #1');
  assert.equal(run([], file), '1. [x] buy milk'); // bare invocation == list
  assert.equal(run(['rm', '1'], file), 'removed #1');
  assert.equal(run(['list'], file), '(no tasks)');
  assert.throws(() => run(['frobnicate'], file), /unknown command: frobnicate/);
});

test('clearDone removes only done tasks, keeps the rest and their ids, returns the count', () => {
  const tasks = [
    { id: 1, text: 'a', done: true },
    { id: 2, text: 'b', done: false },
    { id: 3, text: 'c', done: true },
  ];
  assert.equal(clearDone(tasks), 2);
  assert.deepEqual(tasks, [{ id: 2, text: 'b', done: false }]);
});

test('run clear prunes done tasks, saves, and reports the count', () => {
  const file = tmpFile();
  save(file, [
    { id: 1, text: 'a', done: true },
    { id: 2, text: 'b', done: false },
  ]);
  assert.equal(run(['clear'], file), 'cleared 1 completed');
  assert.deepEqual(load(file), [{ id: 2, text: 'b', done: false }]);
});

test('run clear with nothing done is a no-op save reporting no completed tasks', () => {
  const file = tmpFile();
  save(file, [{ id: 1, text: 'a', done: false }]);
  assert.equal(run(['clear'], file), 'no completed tasks');
  assert.deepEqual(load(file), [{ id: 1, text: 'a', done: false }]);
});

test('storePath honours $TODO_FILE override', () => {
  const prev = process.env.TODO_FILE;
  process.env.TODO_FILE = '/tmp/explicit-todo.json';
  try {
    assert.equal(storePath(), '/tmp/explicit-todo.json');
  } finally {
    if (prev === undefined) delete process.env.TODO_FILE;
    else process.env.TODO_FILE = prev;
  }
});
