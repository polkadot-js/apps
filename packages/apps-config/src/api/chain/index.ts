// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { typesChain } from '@phala/typedefs';

import { objectSpread } from '@polkadot/util';

import CrustMaxwell from './crust-maxwell';

// alphabetical, based on the actual displayed name
export default objectSpread({}, typesChain, {
  'Crust Maxwell': CrustMaxwell
});
