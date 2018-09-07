// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KEYS } from '../../constants';

export default function isCopy (event: KeyboardEvent, isPreKeyDown: boolean): boolean {
  return isPreKeyDown && (event.which || event.keyCode) === KEYS.C;
}
