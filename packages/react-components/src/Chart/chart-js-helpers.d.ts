// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

declare module 'chart.js/dist/helpers.esm.js' {
  export const color: (c: string) => {
    alpha: (a: number) => {
      rgbString: () => string;
    };
  };
}
