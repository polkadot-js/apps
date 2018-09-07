// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KEYS } from '../../constants';

const regexDecimalPoint = /[\.]/gi;

export default function isDuplicateDecimalPoint (event: KeyboardEvent): boolean {
  const inputValue: string = (event.target as HTMLInputElement).value;
  const didPressDecimalPoint: boolean = event.key === KEYS.DECIMAL_POINT;
  const foundExistingDecimalPoint: boolean = inputValue.match(regexDecimalPoint) ? true : false;
  return didPressDecimalPoint && foundExistingDecimalPoint;
}
