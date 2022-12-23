// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CategoryScale, Chart, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import crosshairPlugin from 'chartjs-plugin-crosshair';

import Doughnut from './Doughnut';
import HorizBar from './HorizBar';
import Line from './Line';

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, annotationPlugin, crosshairPlugin);

export default {
  Doughnut,
  HorizBar,
  Line
};
