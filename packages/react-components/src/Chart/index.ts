// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as chartJs from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import crosshairPlugin from 'chartjs-plugin-crosshair';

import Doughnut from './Doughnut';
import HorizBar from './HorizBar';
import Line from './Line';

chartJs.Chart.register(chartJs.CategoryScale, chartJs.LinearScale, chartJs.LineElement, chartJs.PointElement, chartJs.Title, chartJs.Tooltip, annotationPlugin, crosshairPlugin);

export default {
  Doughnut,
  HorizBar,
  Line
};
