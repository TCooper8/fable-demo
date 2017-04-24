'use strict';

const Try = require('../bin/Try').TryModule;

let pipeline = fns => {
  var i = -1;
  var length = fns.length;
  var acc = undefined;

  while (++i < length) {
    acc = fns[i](acc);
  }
  return acc;
}

let res =
  pipeline ([
    () => Try.success(5),
    value => Try.map(x => x * x, value),
    value => Try.map(x => x * x, value),
    value => Try.map(x => { throw new Error(x) }, value),
    value => Try.recover(e => e.message, value),
    value => Try.map(x => x * x, value),
    value => Try.map(x => x * x, value)
  ])
