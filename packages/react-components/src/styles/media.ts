// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { css } from 'styled-components';

export default css`
  /* block by default, flex as per media queries below */
  .ui--flex-large,
  .ui--flex-medium,
  .ui--flex-small {
    display: block;
  }

  /* hide all by default, add as per media queries below */
  .ui--media-large,
  .ui--media-medium,
  .ui--media-small {
    height: 0;
    visibility: hidden;
    width: 0;
  }

  td.ui--media-large,
  td.ui--media-medium,
  td.ui--media-small,
  th.ui--media-large,
  th.ui--media-medium,
  th.ui--media-small {
    display: none;
  }

  @media (min-width: 1281px) {
    .ui--flex-large {
      display: flex;
      flex-wrap: wrap;
    }

    .ui--media-large {
      height: auto;
      visibility: visible;
      width: auto;
    }

    td.ui--media-large,
    th.ui--media-large {
      display: table-cell;
    }
  }

  @media (min-width: 1025px) {
    .ui--flex-medium {
      display: flex;
      flex-wrap: wrap;
    }

    .ui--media-medium {
      height: auto;
      visibility: visible;
      width: auto;
    }

    td.ui--media-medium,
    th.ui--media-medium {
      display: table-cell;
    }
  }

  @media (min-width: 768px) {
    .ui--flex-small {
      display: flex;
      flex-wrap: wrap;
    }

    .ui--media-small {
      height: auto;
      visibility: visible;
      width: auto;

    }

    td.ui--media-small,
    th.ui--media-small {
      display: table-cell;
    }
  }

  /* tabs */
  @media (max-width: 991px) {
    .ui.menu.tabular {
      padding-left: 5.2rem !important;
    }
  }
`;
