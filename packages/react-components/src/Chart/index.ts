// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartType, Plugin } from 'chart.js';

import { CategoryScale, Chart, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import crosshairPlugin from 'chartjs-plugin-crosshair';

import Doughnut from './Doughnut.js';
import HorizBar from './HorizBar.js';
import Line from './Line.js';

interface CrosshairChart {
  crosshair?: boolean;
}

function CustomCrosshairPlugin (plugin: Plugin<ChartType>): Plugin<ChartType> {
  const originalAfterDraw = plugin.afterDraw;

  if (originalAfterDraw) {
    plugin.afterDraw = function (chart, args): void {
      if ((chart as CrosshairChart).crosshair) {
        // @ts-expect-error - Pass exactly what the original plugin expects
        originalAfterDraw.call(this, chart, args);
      }
    };
  }

  return plugin;
}

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  annotationPlugin,
  CustomCrosshairPlugin(crosshairPlugin as Plugin<ChartType>)
);

export default {
  Doughnut,
  HorizBar,
  Line
};
