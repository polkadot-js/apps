// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { typesBundleForPolkadot } from '@laminar/type-definitions';

export default typesBundleForPolkadot.spec.laminar as unknown as OverrideBundleDefinition;
