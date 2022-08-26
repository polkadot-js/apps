// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint sort-keys: ["error", "asc", { caseSensitive: false }] */

import gmSpec from './gm.json';
import tinkernetSpec from './tinkernet.json';

// Add your imported spec here in alphabetical order.
// The key here reflects the URL of the light client endpoint.
// e.g. light://substrate-connect/kusama/gm
export const lightSpecs: Record<string, unknown> = {
  gm: gmSpec,
  tinkernet: tinkernetSpec
};
