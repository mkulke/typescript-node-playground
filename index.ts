'use strict';

import _ = require('lodash');
const assert = require('assert');

type EqualOrNothing = number | null;

interface SomeObject {
  orig: number,
  mod: EqualOrNothing,
}

assert(true);
const mgns: SomeObject[] = _.map([1, 2], orig => {
  const mod = orig % 2 === 0 ? orig : null;
  return { orig, mod };
});
console.log('%j', mgns);
