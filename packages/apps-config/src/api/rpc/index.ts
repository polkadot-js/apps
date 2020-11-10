// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import moonbeam from './moonbeam';

// mapping from specName in state.getRuntimeVersion
export default {
  // Moonbeam rpc types (Frontier)
  ...moonbeam()
};
