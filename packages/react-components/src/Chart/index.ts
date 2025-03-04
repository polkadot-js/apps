// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CategoryScale, Chart, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import crosshairPlugin from 'chartjs-plugin-crosshair';

import Doughnut from './Doughnut.js';
import HorizBar from './HorizBar.js';
import Line from './Line.js';

const CustomCrosshairPlugin = function (plugin: any) {  
  const originalAfterDraw = plugin.afterDraw;  
  plugin.afterDraw = function(chart:any, easing: any) {  
      if (chart && chart.crosshair) {  
        originalAfterDraw.call(this, chart, easing);  
      }  
  };  
  return plugin;  
};
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, annotationPlugin, CustomCrosshairPlugin(crosshairPlugin));


export default {
  Doughnut,
  HorizBar,
  Line
};
