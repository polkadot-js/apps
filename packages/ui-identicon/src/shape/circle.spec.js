// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const xmlserializer = require('xmlserializer');

const seeder = require('../seeder');
const circle = require('./circle');

describe('circle', () => {
  it('creates a circle shape', () => {
    expect(
      xmlserializer.serializeToString(
        circle(seeder(), 'blue', 50, 2)
      )
    ).toEqual('<circle xmlns="http://www.w3.org/2000/svg" cx="25" cy="32.5" r="15" fill="blue"/>');
  });
});
