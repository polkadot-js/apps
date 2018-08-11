// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import storage from '@polkadot/storage';

import numberFormat from './util/numberFormat';
import withObservableDiv from './with/apiObservableDiv';

const method = storage.timestamp.public.blockPeriod;

const Component: React.ComponentType<any> = withObservableDiv('timestampBlockPeriod')(
  (value?: BN): string =>
    `${numberFormat(value)}.0s`,
  { className: 'rx--TimePeriod' }
);

export default Component;
