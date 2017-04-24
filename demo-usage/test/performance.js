'use strict';

const Performance = require('../bin/Performance');
const _ = require('lodash');
console.dir(Performance);

let iters = 1000;
//let iters = 100000000;

let timef = (label, f) => {
  console.time(label);
  //var i = -1, length = 1000000;
  //while (++i < length) {
    //f();
  //}
  let res = f();
  console.timeEnd(label);
  console.log('%s: %s', label, res);
}

let timefMulti = (label, f, tests) => {
  console.time(label);
  var i = -1, length = tests;
  while (++i < length) {
    f();
  }
  console.timeEnd(label);
}

let f = (iters) => {
  var length = iters,
      i = -1,
      sum = 0;

  while (++i < length) {
    sum += i;
  }

  return sum;
}

//timef ("Lodash", () => _.sum(_.range(iters)));
//timef ("Fable.testSeq", () => Performance.testSeq(iters));
//timef ("Fable.testForLoop", () => Performance.testForLoop(iters));
//timef ("VanillaJS", () => f (iters));

let tests = 100000;

//timefMulti ("Lodash", () => _.sum(_.range(iters)), tests);
//timefMulti ("Fable.testSeq", () => Performance.testSeq(iters), tests);
timefMulti ("Fable.testForLoop", () => Performance.testForLoop(iters), tests);
//timef ("VanillaJS", () => f (iters));
