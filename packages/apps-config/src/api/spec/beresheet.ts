// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import pkg from '@edgeware/node-types';

// There is no separate types bundle for testnet at this time
const beresheet = pkg.spec.typesBundle.spec?.edgeware as OverrideBundleDefinition;

export default beresheet;
