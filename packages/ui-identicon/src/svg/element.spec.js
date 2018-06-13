// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const xmlserializer = require('xmlserializer');

const element = require('./element');

describe('element', () => {
  it('creates a basic SVG element', () => {
    expect(
      xmlserializer.serializeToString(
        element(123)
      )
    ).toEqual('<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="123" height="123"/>');
  });
});
