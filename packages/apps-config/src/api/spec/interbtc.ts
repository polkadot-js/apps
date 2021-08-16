// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import definitions from '@interlay/interbtc-types';

// This is a temp work-around to add the interfaces key to the actual types
// With the next release of the API this should be able tp be added to the base
const extended = definitions as OverrideBundleDefinition;

export default extended;
