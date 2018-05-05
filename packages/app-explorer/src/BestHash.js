// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';

import headerHash from '@polkadot/primitives-codec/header/hash';
import Div from '@polkadot/rx-react/Div';
import withApiCall from '@polkadot/rx-react/with/apiCall';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';

const apiMethod = {
  method: 'newHead',
  section: 'chain'
};

const props = {
  className: 'explorer--BestHash',
  format: (value?: Header): ?string =>
    value
      ? u8aToHexShort(headerHash(value))
      : value
};

export default withApiCall(apiMethod)(Div, props);
