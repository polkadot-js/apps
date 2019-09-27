// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { css } from 'styled-components';

import { ScreenSizes } from './constants';

type MediaCss = {
  [index in keyof typeof ScreenSizes]: (values: TemplateStringsArray) => any
};

const media = Object
  .keys(ScreenSizes)
  .reduce((acc: MediaCss, label: any): MediaCss => {
    const size: number = ScreenSizes[label] as any;

    acc[label] = (values: TemplateStringsArray): unknown =>
      css`
        @media (min-width: ${size / 16}em) {
          ${values}
        }
      `;

    return acc;
  }, {} as unknown as MediaCss);

export default media;
