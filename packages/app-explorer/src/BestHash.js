// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';

import headerHash from '@polkadot/primitives-codec/header/hash';
import withApiDiv from '@polkadot/ui-react-rx/with/apiDiv';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';

export default withApiDiv({ name: 'newHead', section: 'chain' })(
  (value?: Header): ?string => {
    return value
      ? u8aToHexShort(headerHash(value))
      : value;
  },
  { className: 'explorer--BestHash' }
);
