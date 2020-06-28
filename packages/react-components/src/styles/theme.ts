// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { css } from 'styled-components';

/* highlighted buttons, orange */
export const colorBtnHighlight = '#f19135';

export default css`
  :root {
    /* colors */
    --blue-primary: #2477B3;
    --blue-secondary: #195580;
    --green-primary: #16DB9A;
    --red-primary: #F54E4E;

    --grey00: #000;
    --grey10: #151B1F;
    --grey15: #202B33;
    --grey20: #2B3840; /* header text */
    --grey30: #33434D;
    --grey50: #777B80;
    --grey70: #A0A2A3;
    --grey80: #DFE2E6;

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
      background-color: var(--white);
      border: 1px solid var(--grey80);
      color: var(--grey50);
      font-family: var(--default-font-family, sans-serif);
      font-weight: 500;

      &.active,
      &:active,
      &:focus,
      &:hover {
        background-color: var(--white);
        border: 1px solid var(--blue-primary);
        color: var(--blue-primary);
      }

      /* &:hover {
        filter: brightness(120%);
      } */

      &.isIcon {
        i.icon {
          color: var(--blue-primary);
        }
      }
    }

    .ui.small.button,
    .ui.small.buttons .button,
    .ui.small.buttons .or {
      font-size: 14px;
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
        background-color: var(--red-primary);
        border: 1px solid var(--red-primary);
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
      color: var(--grey20);
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
      color: var(--grey20);
    }

    .ui.selection.dropdown {
      border-color: var(--grey80);
    }
  }
`;
