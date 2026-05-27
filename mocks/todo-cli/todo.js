#!/usr/bin/env node
'use strict';

// Dependency-free single-file todo CLI. Stores tasks as JSON.
// Storage path: $TODO_FILE, else ~/.todo-cli.json. Core ops are exported
// so tests can drive them against a temp file without spawning a process.

const fs = require('fs');
const os = require('os');
const path = require('path');

function storePath() {
  return process.env.TODO_FILE || path.join(os.homedir(), '.todo-cli.json');
}

function load(file) {
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  if (raw.trim() === '') return [];
  return JSON.parse(raw);
}

function save(file, tasks) {
  fs.writeFileSync(file, JSON.stringify(tasks, null, 2) + '\n');
}

function add(tasks, text) {
  if (!text) throw new Error('add: text required');
  const id = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  tasks.push({ id, text, done: false });
  return id;
}

function done(tasks, id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new Error(`done: no task #${id}`);
  task.done = true;
}

function remove(tasks, id) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error(`rm: no task #${id}`);
  tasks.splice(idx, 1);
}

function edit(tasks, id, text) {
  if (!text) throw new Error('edit: text required');
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new Error(`edit: no task #${id}`);
  task.text = text;
}

function clearDone(tasks) {
  let removed = 0;
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].done) {
      tasks.splice(i, 1);
      removed++;
    }
  }
  return removed;
}

function format(tasks) {
  if (tasks.length === 0) return '(no tasks)';
  return tasks
    .map((t) => `${t.id}. [${t.done ? 'x' : ' '}] ${t.text}`)
    .join('\n');
}

function run(argv, file) {
  const [cmd, ...rest] = argv;
  const tasks = load(file);
  switch (cmd) {
    case 'add': {
      const id = add(tasks, rest.join(' '));
      save(file, tasks);
      return `added #${id}`;
    }
    case 'done': {
      done(tasks, Number(rest[0]));
      save(file, tasks);
      return `done #${rest[0]}`;
    }
    case 'rm': {
      remove(tasks, Number(rest[0]));
      save(file, tasks);
      return `removed #${rest[0]}`;
    }
    case 'edit': {
      const [id, ...words] = rest;
      edit(tasks, Number(id), words.join(' '));
      save(file, tasks);
      return `edited #${id}`;
    }
    case 'clear': {
      const removed = clearDone(tasks);
      save(file, tasks);
      return removed === 0 ? 'no completed tasks' : `cleared ${removed} completed`;
    }
    case 'list':
    case undefined:
      return format(tasks);
    default:
      throw new Error(`unknown command: ${cmd}`);
  }
}

module.exports = { load, save, add, done, remove, clearDone, edit, format, run, storePath };

if (require.main === module) {
  try {
    console.log(run(process.argv.slice(2), storePath()));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
