// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { css } from 'styled-components';

import { ELEV_2_CSS, ELEV_3_CSS } from './constants';

/* highlighted buttons, orange */
const colorBtnHighlight = '#2477B3';

export default css`
  :root {
    /* colors */
    --background: #11161A;

    --blue-primary: #2477B3;
    --blue-secondary: #195580;
    --green-primary: #16DB9A;
    --red-primary: #F54E4E;
    --red-secondary: #FF8080;
    --orange-primary: #F8C34F;

    --grey00: #000;
    --grey10: #151B1F;
    --grey15: #1C2429;
    --grey20: #202B33; /* header text */
    --grey30: #2B3840;
    --grey40: #33434D;
    --grey50: #777B80;
    --grey60: #A0A2A3;
    --grey70: #C6CACC;
    --grey80: #DFE2E6;
    --grey90: #E0E1E1;

    --white: #FFF;

    /* radii*/
    --btn-radius-default: 4px;

    /* typography */
    --default-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
  }

  .theme--default {
    a {
      color: var(--blue-primary);

      &:hover,
      a:visited {
        color: var(--blue-primary);
      }
    }

    .ui.button,
    .ui.buttons .button {
      background-color: transparent;
      color: var(--grey80);

      &.dropdown {
        border: none !important;
        border-bottom-left-radius: 0 !important;
        border-top-left-radius: 0 !important;
        ${ELEV_2_CSS}

        &:hover {
          ${ELEV_3_CSS}
        }
      }

      &:not(.isIcon):not(.dropdown) {
        border-color: var(--grey30);
        border-width: 2px;
        border-style: solid;

        &:focus,
        &:hover {
          border-color: var(--blue-secondary);
        }

        &.primary {
          background-color: var(--blue-primary);
          border-color: var(--blue-primary);

          &:focus,
          &:hover {
            background-color: var(--blue-secondary);
            border-color: var(--blue-secondary);
          }
        }
      }

      /* &:hover {
        filter: brightness(120%);
      } */

      &.isIcon {
        .svg-inline--fa {
          color: var(--blue-primary);
        }
      }
    }

    .ui.small.button,
    .ui.small.buttons .button,
    .ui.small.buttons .or {
      font-size: 0.875rem;
    }

    .ui.basic.negative.button {
      // box-shadow: 0 0 0 1px ${colorBtnHighlight} inset !important;
      // color: ${colorBtnHighlight} !important;
    }

    .ui.negative.button,
    .ui.buttons .negative.button {

      &:active,
      &:active,
      &:focus,
      &:hover {
        border-color: var(--red-primary);
        color: white;
      }
    }

    .ui.primary.button,
    .ui.buttons .primary.button
    /*, .ui.primary.buttons .button (for dropdowns) */ {
      // background-color: var(--blue-primary);

      // &.active,
      // &:active,
      // &:focus,
      // &:hover {
      //   background-color: var(--blue-secondary);
      // }
    }

    .ui.blue.progress .bar {
      background-color: ${colorBtnHighlight};
    }

    &.ui.modal > .header:not(.ui),
    .ui.modal > .header:not(.ui) {
      color: var(--grey80);
      font-weight: 300;
    }

    .ui.menu.tabular .item.active {
      border-bottom-color: ${colorBtnHighlight};
    }

    /* this is for dropdown buttons */
    .ui.buttons .ui.button.selection.visible.dropdown {
      &:hover {
        /* reset opacity, this is now open */
        opacity: 1;
      }

      > .text:not(.default) {
        color: var(--grey-50);
      }
    }

    .ui.toggle.checkbox input:checked~.box:before,
    .ui.toggle.checkbox input:checked~label:before {
      // background-color: ${colorBtnHighlight} !important;
    }

    .ui.input>input {
      color: var(--grey80);
    }
  }
`;
