// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import pkg from '@edgeware/node-types';

const edgeware = (pkg.spec.typesBundle as { spec: { edgeware: OverrideBundleDefinition }}).spec.edgeware;

export default edgeware;
