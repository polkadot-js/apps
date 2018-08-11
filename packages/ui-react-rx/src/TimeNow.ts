// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import Elapsed from '@polkadot/ui-react/Elapsed';
import withApiObservble from './with/observable';

const Component: React.ComponentType<any> = withApiObservble('timestampNow', { propName: 'value' })(
  Elapsed,
  { className: 'rx--TimeNow' }
);

export default Component;
