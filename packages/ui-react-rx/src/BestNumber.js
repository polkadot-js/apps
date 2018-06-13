// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';

import rpcs from '@polkadot/jsonrpc';

import numberFormat from './util/numberFormat';
import withApiDiv from './with/apiDiv';

export default withApiDiv(rpcs.chain.public.newHead)(
  (value?: Header): string => {
    return value && value.number
      ? numberFormat(value.number)
      : 'unknown';
  },
  { className: 'rx--BestNumber' }
);
