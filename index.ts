'use strict';

import _ = require('lodash');
import assert = require('assert');
import myModule = require('./myModule');

type EqualOrNothing = number | null;

interface SomeObject {
  orig: number;
  mod: EqualOrNothing;
}

assert(myModule.test);
const mgns: SomeObject[] = _.map([1, 2], orig => {
  const mod = orig % 2 === 0 ? orig : null;
  return { orig, mod };
});
console.log('%j', mgns);
