// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { css } from 'styled-components';

export default css`
  .ui--grid,
  .ui--row {
    width: 100%;
  }

  .ui--grid,
  .ui--row {
    align-items: stretch;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
    min-width: 0;
  }

  .ui--grid > div,
  .ui--row > div {
    box-sizing: border-box;
    min-width: 0;
  }

  .ui--grid > div:not(.grow):not(.shrink),
  .ui--row > div:not(.grow):not(.shrink) {
    width: 100%;
  }

  .ui--grid > div:not(.shrink),
  .ui--grid > div.full,
  .ui--row > div.full {
    flex: 0 100%;
  }

  .ui--grid > div.shrink,
  .ui--row > div.shrink {
    flex: 0 1 auto;
  }

  .ui--grid > div.grow,
  .ui--row > div.grow {
    flex: 1 1 auto;
  }

  .ui--grid > div.large,
  .ui--row > div.large {
    flex: 0 75%;
  }

  .ui--grid > div.medium,
  .ui--row > div.medium {
    flex: 0 50%;
  }

  .ui--grid > div.small,
  .ui--row > div.small {
    flex: 0 25%;
  }

  .ui--grid > div.sixty6,
  .ui--row > div.sixty6 {
    flex: 0 66.66%;
  }

  .ui--grid > div.thirty3,
  .ui--row > div.thirty3 {
    flex: 0 33.33%;
  }
`;
