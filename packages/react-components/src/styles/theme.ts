// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { css } from 'styled-components';

/* default buttons, dark gray */
export const colorBtnDefault = '#767778';

export const colorBtnShadow = '#98999a';

/* highlighted buttons, orange */
export const colorBtnHighlight = '#f19135';

/* primary buttons, blue */
export const colorBtnPrimary = colorBtnDefault; // '#2e86ab';

/* button text color */
export const colorBtnText = '#f9f8f7';

export const colorLink = '#2e86ab';

export default css`
  .theme--dark,
  .theme--light {
    a:not(.ui--Tab) {
      color: ${colorLink};

      &:hover,
      a:visited {
        color: ${colorLink};
      }
    }

    .ui--Button {
      &:hover:not(.isDisabled) {
        filter: brightness(110%);
      }

      &.isIcon:not(.isDisabled):not(.withoutLink):not(:hover) {
        .ui--Icon {
          color: ${colorLink};
        }
      }
    }

    .ui.modal > .header:not(.ui) {
      border-bottom-color: ${colorBtnDefault};
    }

    .ui.negative.button,
    .ui.buttons .negative.button {
      background: #666 !important;
    }
  }

  .theme--dark {
    .ui--HelpOverlay {
      .help-button {
        color: rgba(254, 242, 240, 0.9);
      }
    }

    .ui--Table {
      tbody tr {
        // &:nth-child(odd) {
        //   background: #faf8f6;
        // }

        &:nth-child(odd) {
          background: white;
        }
      }

      thead tr {
        background: #6e6c6a;

        &:not(.filter) {
          th {
            color: rgba(254, 240, 240, 0.66);
          }
        }
      }
    }

    .ui--Tabs {
      background: #6e6c6a;

      .ui--Tab {
        color: rgba(254, 242, 240, 0.9);
      }
    }

    .ui--TopMenu {
      &.isLoading {
        .menuActive {
          // background: #f5f3f1;
        }
      }

      .menuActive {
        background: #6e6c6a;
        color: rgba(254, 242, 240, 0.9);
      }
    }
  }

  .theme--light {
    .ui--HelpOverlay {
      .help-button {
        color: #4e4e4e;
      }
    }

    .ui--Table {
      tbody tr {
        // &:nth-child(odd) {
        //   background: #faf8f6;
        // }

        &:nth-child(odd) {
          background: white;
        }
      }

      thead tr {
        background: white;

        &:not(.filter) {
          th {
            color: rgba(78, 78, 78, 0.66);
          }
        }
      }
    }

    .ui--Tabs {
      background: #fff;

      .ui--Tab {
        color: #4e4e4e;
      }
    }

    .ui--TopMenu {
      &.isLoading {
        .menuActive {
          background: #f5f3f1;
        }
      }

      .menuActive {
        background: #fff;
        color: #4e4e4e;
      }
    }
  }
`;
