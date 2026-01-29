// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as helpers from 'chart.js/helpers';

export function alphaColor (hexColor: string): string {
  return helpers.color(hexColor).alpha(0.65).rgbString();
}
