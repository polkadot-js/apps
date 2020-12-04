// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import moonbeam from './moonbeam';
import soraSubstrate from './soraSubstrate';

// Add your rpc method definitions here
export default {
  // Moonbeam rpc types (Frontier)
  ...moonbeam(),
  // SORA-Substrate rpc
  ...soraSubstrate // FIXME: 'sora-substrate': soraSubstrate when resolve-by-specname is available
};
