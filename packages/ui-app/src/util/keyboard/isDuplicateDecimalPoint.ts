// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KEYS } from '../../constants';

const regexDecimalPoint = /[\.]/gi;

export default function isDuplicateDecimalPoint (event: any): boolean {
  return event.keyCode === KEYS.DECIMAL_POINT && event.target.value.match(regexDecimalPoint);
}
