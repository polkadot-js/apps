// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { withCall } from '@polkadot/ui-api/index';

import Elapsed from './Elapsed';

export default withCall('query.timestamp.now', { propName: 'value' })(Elapsed);
