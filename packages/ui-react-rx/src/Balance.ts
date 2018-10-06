// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import balanceFormat from './util/balanceFormat';
import withObservableDiv from './with/observableDiv';

const Component: React.ComponentType<any> = withObservableDiv('balanceFree')(
  balanceFormat,
  { className: 'rx--Balance' }
);

export default Component;
