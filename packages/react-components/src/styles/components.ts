// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { css } from 'styled-components';
import { ELEV_2_CSS, ELEV_4_CSS } from './constants';

export default css`
  .ui--output {
    ${ELEV_4_CSS}
    color: var(--grey80);
    box-sizing: border-box;
    flex-grow: 1;
    line-height: 1rem;
    padding: 0.5rem 0.75rem;
    position: relative;
    word-break: break-all;

    &.error {
      background: #fff6f6;
      border-color: #e0b4b4;
    }

    &.monospace {
      font-family: monospace;
    }

    .ui--output-button {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
    }
  }

  .ui--Button-Group .button {
    border-radius: 0.1875rem !important;
  }

  header .ui--Button-Group {
    text-align: center;
  }

  .ui.input .ui--Button-Group {
    margin: 0;
  }

  button.ui.icon.icon-button {
    margin-left: 0.5rem;
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0;
    padding-left: 0;
    color: var(--blue-primary) !important;
    background: none !important;
  }

  .editable {
    cursor: pointer;
  }

  .ui--DropdownLinked.ui--row {
    .small .ui.selection.dropdown {
      border-right: none;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      min-width: 5rem;
    }

    .large .ui.selection.dropdown {
      border-left: none;
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }
  }

  .ui--Input {
    &.disabled {
      overflow: hidden;

      input {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &.inPlaceEditor {
      margin: 0 !important;

      input {
        padding: 0 !important;
        background: rgba(230, 230, 230, 0.8) !important;
        border: 0 !important;
        border-radius: 0 !important;
        box-shadow: 0 3px 3px rgba(0,0,0,.2);
      }
    }

    .ui--SiDropdown {
      ${ELEV_2_CSS}
      border: none;
      width: 6rem;
      text-align: center;
    }

    .ui--MaxButton {
      position: absolute;
      right: 6.5rem;
      top: 20%;
      height: 60%;
      text-transform: uppercase;
      padding: 0 0.5rem !important;
      border-radius: 0.3rem !important;
    }
  }

  .ui--Static {
    min-width: 2rem; /* adjust width from normal dropdown sizing */
    overflow: hidden;
    word-break: break-all;
  }

  .ui--Tooltip {
    text-align: center;
    z-index: 1002;
    max-width: 300px;
  }
`;
