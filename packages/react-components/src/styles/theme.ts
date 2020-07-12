// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { css } from 'styled-components';

/* default buttons, dark gray */
export const colorBtnDefault = '#666';

/* highlighted buttons, orange */
export const colorBtnHighlight = '#f19135';

/* primary buttons, blue */
export const colorBtnPrimary = colorBtnDefault; // '#2e86ab';

/* button text color */
export const colorBtnText = '#f9f8f7';

export const colorLink = '#2e86ab';

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

      &.isIcon {
        .ui--Icon {
          color: ${colorLink};
        }
      }
    }

    .ui.blue.progress .bar {
      background-color: ${colorBtnHighlight};
    }

    .ui.modal > .header:not(.ui) {
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
  }
`;
