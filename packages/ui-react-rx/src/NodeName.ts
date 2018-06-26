// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import rpcs from '@polkadot/jsonrpc';

import withApiDiv from './with/apiDiv';

const method = rpcs.system.public.name;

const Component: React.ComponentType<any> = withApiDiv(method)(
  (value: string = 'unknown'): string =>
    value,
  { className: 'rx--NodeName' }
);

export default Component;
