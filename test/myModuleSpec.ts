'use strict';

import chai = require('chai');
import myModule = require('../myModule');

const expect = chai.expect;

describe('test/myModuleSpec', function() {
  it('works', function() {
    expect(myModule.toast()).to.equal(true);
  });
});
