// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pkg from '@edgeware/node-types';

// There is no separate types bundle for testnet at this time
const beresheet = (pkg.spec.typesBundle as { spec: { edgeware: OverrideBundleDefinition } }).spec.edgeware;

export default beresheet;
