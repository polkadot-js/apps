// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import storage from '@polkadot/storage';

import Elapsed from '@polkadot/ui-react/Elapsed';
import withStorage from './with/storage';

const method = storage.timestamp.public.now;

const Component: React.ComponentType<any> = withStorage(method, { propName: 'value' })(
  Elapsed,
  { className: 'rx--TimeNow' }
);

export default Component;
