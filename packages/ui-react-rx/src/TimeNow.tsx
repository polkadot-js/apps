// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { withCall } from './with/index';
import Elapsed from './Elapsed';

const Component: React.ComponentType<any> = withCall('query.timestamp.now', { propName: 'value' })(
  Elapsed
);

export default Component;
