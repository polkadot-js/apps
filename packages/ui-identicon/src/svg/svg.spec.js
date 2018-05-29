// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const xmlserializer = require('xmlserializer');

const svg = require('./svg');

describe('svg', () => {
  it('creates a basic SVG element', () => {
    expect(
      xmlserializer.serializeToString(
        svg('rect')
      )
    ).toEqual('<rect xmlns="http://www.w3.org/2000/svg"/>');
  });
});
