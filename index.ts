'use strict';

const _ = require('lodash');
const assert = require('assert');

assert(true);
const mgns = _.map([1, 2], e => e + 1);
console.log(mgns.join(','));
