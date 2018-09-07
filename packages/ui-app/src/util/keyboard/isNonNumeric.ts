// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import isNotDigit from './isNotDigit';
import isNotDigitOnNumpad from './isNotDigitOnNumpad';

export default function isNonNumeric (event: KeyboardEvent): boolean {
  return isNotDigit(event) && isNotDigitOnNumpad(event);
}
