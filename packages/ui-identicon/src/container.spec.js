// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const container = require('./container');

describe('container', () => {
  it('applies default styles', () => {
    expect(
      container(100).style._values
    ).toMatchObject({
      'background': 'white',
      'border-radius': '50px',
      'display': 'inline-block',
      'height': '100px',
      'margin': '0px',
      'overflow': 'hidden',
      'padding': '0px',
      'width': '100px'
    });
  });

  it('overrides with supplied styles', () => {
    expect(
      container(50, 'black', '', { display: 'block' }).style._values
    ).toMatchObject({
      'background': 'black',
      'border-radius': '25px',
      'display': 'block',
      'height': '50px',
      'margin': '0px',
      'overflow': 'hidden',
      'padding': '0px',
      'width': '50px'
    });
  });

  it('applies the specified className', () => {
    expect(
      container(100, 'blue', 'testClass').className
    ).toEqual('testClass');
  });
});
