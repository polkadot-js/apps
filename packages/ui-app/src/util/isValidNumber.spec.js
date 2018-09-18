// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BIT_LENGTH_128 } from '../constants';
import translate from '../translate';
import isValidNumber from './isValidNumber';

describe('checks extrinsic balance', () => {
  let t = translate;

  it('throws an error if input value for comparison is not a string', () => {
    const invalidInputValueType = 340282366920938463463374607431768211456;

    expect(() => {
      isValidNumber(invalidInputValueType, '0', t, BIT_LENGTH_128);
    }).toThrow();
  });
});
