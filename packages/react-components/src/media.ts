// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { css } from 'styled-components';

import { ScreenSizes } from './constants';

type MediaCss = {
  [index in keyof typeof ScreenSizes]: (values: TemplateStringsArray) => any
};

const media = Object
  .keys(ScreenSizes)
  .reduce((acc: MediaCss, label: any): MediaCss => {
    const size: number = ScreenSizes[label as 'TABLET'];

    acc[label as 'TABLET'] = (values: TemplateStringsArray): unknown =>
      css`
        @media (min-width: ${size / 16}em) {
          ${values}
        }
      `;

    return acc;
  }, {} as unknown as MediaCss);

export default media;
