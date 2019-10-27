// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { css } from 'styled-components';

export default css`
  .ui--output {
    background: #fefefe;
    border-radius: 4px;
    border: 1px dashed #eee;
    box-sizing: border-box;
    line-height: 1rem;
    margin: 0.25rem;
    padding: .75rem 1rem;
    position: relative;
    word-wrap: break-word;

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
    border-radius: .28571429rem !important;
  }

  header .ui--Button-Group {
    text-align: center;
  }

  .ui.input .ui--Button-Group {
    margin: 0;
  }

  button.ui.icon.icon-button {
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0.3em;
    padding-left: 0.3em;
    color: #2e86ab  !important;
    background: none  !important;
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

    .ui--SiDropdown {
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
