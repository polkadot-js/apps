// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// @ts-expect-error No definitions provided in package
import { standardTypes } from '@digitalnative/type-definitions';

export default standardTypes as OverrideBundleDefinition;
