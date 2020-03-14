// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { css } from 'styled-components';

/* default buttons, dark gray */
const colorBtnDefault = '#666';

/* highlighted buttons, orange */
const colorBtnHighlight = '#f19135';

/* primary buttons, blue */
const colorBtnPrimary = colorBtnDefault; // '#2e86ab';

/* button text color */
const colorBtnText = '#f9f9f9';

const colorLink = '#2e86ab';

export default css`
  .theme--default {
    a {
      color: ${colorLink};

      &:hover,
      a:visited {
        color: ${colorLink};
      }
    }

    .ui.button,
    .ui.buttons .button {
      background-color: ${colorBtnDefault};
      color: ${colorBtnText};

      &.active,
      &:active,
      &:focus,
      &:hover {
        background-color: ${colorBtnDefault};
        color: ${colorBtnText};
      }

      &:hover {
        filter: brightness(120%);
      }
    }

    .ui.basic.negative.button {
      // box-shadow: 0 0 0 1px ${colorBtnHighlight} inset !important;
      // color: ${colorBtnHighlight} !important;
    }

    .ui.negative.button,
    .ui.buttons .negative.button {
      // background-color: ${colorBtnHighlight};

      // &.active,
      // &:active,
      // &:focus,
      // &:hover {
      //   background-color: ${colorBtnHighlight};
      // }
    }

    .ui.primary.button,
    .ui.buttons .primary.button
    /*, .ui.primary.buttons .button (for dropdowns) */ {
      // background-color: ${colorBtnPrimary};

      // &.active,
      // &:active,
      // &:focus,
      // &:hover {
      //   background-color: ${colorBtnPrimary};
      // }
    }

    .ui.blue.progress .bar {
      background-color: ${colorBtnHighlight};
    }

    .ui.modal > .header:not(.ui) {
      border-bottom-color: ${colorBtnHighlight};
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
        color: ${colorBtnText};
      }
    }

    .ui.toggle.checkbox input:checked~.box:before,
    .ui.toggle.checkbox input:checked~label:before {
      background-color: ${colorBtnHighlight} !important;
    }
  }
`;
