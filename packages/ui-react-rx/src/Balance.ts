// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import storage from '@polkadot/storage';

import numberFormat from './util/numberFormat';
import withApiObservableDiv from './with/apiObservableDiv';

const Component: React.ComponentType<any> = withApiObservableDiv('stakingFreeBalanceOf')(
  numberFormat,
  { className: 'rx--Balance' }
);

export default Component;
