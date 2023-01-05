// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { color } from 'chart.js/dist/helpers.esm.js';

export function alphaColor (hexColor: string): string {
  return color(hexColor).alpha(0.65).rgbString();
}
