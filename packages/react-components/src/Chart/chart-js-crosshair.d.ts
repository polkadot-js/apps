// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartType } from 'chart.js';
import type { CrosshairOptions } from 'chartjs-plugin-crosshair';

declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PluginOptionsByType<TType extends ChartType> {
    crosshair: CrosshairOptions;
  }
}
