// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import numberFormat from './util/numberFormat';
import { withObservableDiv } from './with/index';

const Component: React.ComponentType<any> = withObservableDiv('accountNonce')(
  numberFormat,
  { className: 'rx--Nonce' }
);

export default Component;
