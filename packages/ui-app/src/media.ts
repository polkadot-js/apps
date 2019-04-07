// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { css } from 'styled-components';
import { ScreenSizes } from './constants';

export const media = Object
 .keys(ScreenSizes)
 .reduce((acc, label) => {
   acc[label] = (...args) => css`
     @media (min-width: ${ScreenSizes[label] / 16}em) {
      ${css(...args)}
     }
      `;
   return acc;
 }, {});
