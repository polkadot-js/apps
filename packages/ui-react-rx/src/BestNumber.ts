// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';

import rpcs from '@polkadot/jsonrpc';

import numberFormat from './util/numberFormat';
import withApiDiv from './with/apiDiv';

// @ts-ignore check?
const method = rpcs.get('chain').public.newHead;

const Component: React.ComponentType<any> = withApiDiv(method)(
  (value?: Header): string => {
    return value && value.number
      ? numberFormat(value.number)
      : 'unknown';
  },
  { className: 'rx--BestNumber' }
);

export default Component;
