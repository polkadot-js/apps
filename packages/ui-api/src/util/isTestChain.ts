// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { isUndefined } from '@polkadot/util';

const re = new RegExp('(dev|loc)', 'i');

export default function isTestChain (chain?: string): boolean {
  if (isUndefined(chain)) {
    return false;
  }

  const match = re.test(chain.toString().toLowerCase());

  return match ? true : false;
}
