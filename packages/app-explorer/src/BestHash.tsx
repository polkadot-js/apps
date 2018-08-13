// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';

import headerHash from '@polkadot/primitives/codec/header/hash';
import withObservableDiv from '@polkadot/ui-react-rx/with/observableDiv';
import u8aToHex from '@polkadot/util/u8a/toHex';

const Component: React.ComponentType<any> = withObservableDiv('chainNewHead')(
  (value?: Header): string | undefined =>
    value
      ? u8aToHex(headerHash(value), 64)
      : value,
  { className: 'explorer--BestHash' }
);

export default Component;
