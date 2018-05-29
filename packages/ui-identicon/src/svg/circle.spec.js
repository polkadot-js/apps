// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const xmlserializer = require('xmlserializer');

const circle = require('./circle');

describe('circle', () => {
  it('creates a basic SVG circle element', () => {
    expect(
      xmlserializer.serializeToString(
        circle(123, 12, 34)
      )
    ).toEqual('<circle xmlns="http://www.w3.org/2000/svg" cx="12" cy="34" r="123"/>');
  });
});
