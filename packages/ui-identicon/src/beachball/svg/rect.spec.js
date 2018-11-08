// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import xmlserializer from 'xmlserializer';

import rect from './rect';

describe('rect', () => {
  it('creates a basic SVG rect element', () => {
    expect(
      xmlserializer.serializeToString(
        rect(123)
      )
    ).toEqual('<rect xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="123" height="123" rx="7.6875" ry="7.6875"/>');
  });
});
