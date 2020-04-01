// Copyright 2017-2020 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Snippet } from '@polkadot/app-js/types';

// We must fix this :(
/* eslint-disable sort-keys */

export const constsStakingParameters: Snippet = {
  value: 'constsStakingParameters',
  text: 'Get staking parameters',
  label: { color: 'green', children: 'Consts', size: 'tiny' },
  code: `// Get SRML staking parameters as consts
// 'parameter_types' were added to substrate with spec_version: 101.
// This example will throw an error if used with versions before that.

const bondingDuration = api.consts.staking.bondingDuration;
const sessionsPerEra = api.consts.staking.sessionsPerEra;

console.log('Staking bonding duration: ' + bondingDuration);
console.log('Staking sessions per era: ' + sessionsPerEra);`
};
