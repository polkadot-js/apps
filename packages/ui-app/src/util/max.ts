// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export default function max (items: BN[]) {
  return items.reduce((acc: BN, val: BN) => {
    return (val.gt(acc) ? val : acc);
  }, new BN(0));
}
