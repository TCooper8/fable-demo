'use strict';

const Fscheme = require('demo-fscheme');
console.dir(Fscheme);

let x = Fscheme.rep(Fscheme.environment)('(+ 1 2)');
console.log(x)
