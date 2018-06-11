// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const newSeeder = require('./seeder');
const newColors = require('./colors');

describe('colors', () => {
  let colors;

  beforeEach(() => {
    colors = newColors(newSeeder());
  });

  it('generates using default alpha', () => {
    expect(
      colors()
    ).toEqual('hsla(166.70000000000005, 98.6%, 27.6%, 0.9)');
  });

  it('applies specified alpha', () => {
    expect(
      colors(0.5)
    ).toEqual('hsla(166.70000000000005, 98.6%, 27.6%, 0.5)');
  });

  it('rolates colors', () => {
    colors();

    expect(
      colors()
    ).not.toEqual('hsla(166.70000000000005, 98.6%, 27.6%, 0.9)');
  });

  it('works in edge conditions (0xff)', () => {
    const u8a = new Uint8Array(32);

    u8a.fill(255);

    expect(
      colors = newColors(newSeeder(u8a))
    ).not.toThrow();

    expect(
      colors()
    ).toEqual('hsla(234.39999999999998, 75.9%, 51.2%, 0.9)');
  });
});
