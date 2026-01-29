// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default [
  '2000', '1900', '1800', '1700', '1600', '1500', '1400', '1300', '1200', '1100',
  '1000', '900', '800', '700', '600', '500', '400'
].map((size) => `
  .media--${size} {
    @media only screen and (max-width: ${size}px) {
      display: none !important;
    }
  }

  .media--${size}-noPad {
    @media only screen and (max-width: ${size}px) {
      min-width: 0 !important;
      padding: 0 !important;
    }
  }
`).join('');
