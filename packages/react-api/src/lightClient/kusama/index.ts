// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import gm from './gm.json' assert { type: 'json' };
import tinkernet from './tinkernet.json' assert { type: 'json' };

// Add your imported spec here in alphabetical order.
// The key here reflects the URL of the light client endpoint.
// e.g. light://substrate-connect/kusama/gm
export const specs: Record<string, unknown> = {
  gm,
  tinkernet
};
