// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { css } from 'styled-components';
import { ScreenSizes } from './constants';

export const media: any = Object
 .keys(ScreenSizes)
 .reduce((acc: any, label: any) => {
   let size: any = ScreenSizes[label];
   acc[label] = (...args: any) => (
    css`
     @media ( min-width: ${size / 16}em) {
      ${css`${{ ...args }}`}
     }
    `);
   return acc;
 }, {});
