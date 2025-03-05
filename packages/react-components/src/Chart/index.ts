// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartComponentLike } from 'chart.js';

import { CategoryScale, Chart, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import crosshairPlugin from 'chartjs-plugin-crosshair';

import Doughnut from './Doughnut.js';
import HorizBar from './HorizBar.js';
import Line from './Line.js';

function CustomCrosshairPlugin (plugin: Record<string, unknown>): Record<string, unknown> {
  const originalAfterDraw = plugin.afterDraw as (chart: unknown, easing: unknown) => void;

  plugin.afterDraw = function (chart: unknown, easing: unknown): void {
    const chartWithCrosshair = chart as { crosshair?: unknown };

    if (chartWithCrosshair.crosshair) {
      originalAfterDraw.call(this, chart, easing);
    }
  };

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
  CustomCrosshairPlugin(crosshairPlugin) as unknown as ChartComponentLike
);

export default {
  Doughnut,
  HorizBar,
  Line
};
