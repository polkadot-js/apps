// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
  .theme--default {
    a {
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

      &.isIcon:not(.isDisabled) {
        .ui--Icon {
          color: ${colorLink};
        }
      }
    }

    .ui.modal > .header:not(.ui) {
      border-bottom-color: ${colorBtnDefault};
    }
  }
`;
