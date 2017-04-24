'use strict';

const FScheme = require('../lib');
const readline = require('readline')

const repl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>>> '
});

repl.prompt();

let env = FScheme.environment;

repl.on('line', expr => {
  try {
    let res = FScheme.rep(env)(expr);
    console.log('%s', res);
  }
  catch (e) {
    console.log(e);
  }
  repl.prompt()
});
