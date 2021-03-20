// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { typesBundleForPolkadot } from '@crustio/type-definitions';

export default typesBundleForPolkadot.spec.crust as unknown as OverrideBundleDefinition;
