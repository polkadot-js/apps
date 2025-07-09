// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

declare module 'chart.js/helpers' {
  export const color: (c: string) => {
    alpha: (a: number) => {
      rgbString: () => string;
    };
  };
}
