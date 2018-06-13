// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import rpcs from '@polkadot/jsonrpc';

import withApiDiv from './with/apiDiv';

export default withApiDiv(rpcs.system.public.chain)(
  (value: string = 'unknown'): string =>
    value,
  { className: 'rx--Chain' }
);
