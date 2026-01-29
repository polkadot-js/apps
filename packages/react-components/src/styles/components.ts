// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default `
  .ui--output {
    background: var(--bg-input);
    border-radius: 4px;
    border: 1px dashed #eee;
    box-sizing: border-box;
    line-height: 1rem;
    max-height: 25rem;
    overflow-y: auto;
    padding: 0.75rem 1rem;
    position: relative;
    word-break: break-all;

    &.error {
      background: var(--bg-input-error);
      border-color: #e0b4b4;
    }

    &.monospace {
      font-family: monospace;
    }
  }

  header .ui--Button-Group {
    text-align: center;
  }

  .ui.input .ui--Button-Group {
    margin: 0;
  }

  button.u.ui--Icon.icon-button {
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0.3em;
    padding-left: 0.3em;
    color: #2e86ab !important;
    background: none !important;
  }

  button.ui--Button {
    font: var(--font-sans);
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

  .ui--Identicon-React-Base {
    border: 1px solid var(--border-identicon);
    border-radius: 50%;
    display: inline-block;
    overflow: hidden;

    svg circle:first-child {
      fill: var(--bg-identicon-circle);
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

    &.isWarning.ui.input {
      > input,
      input:focus {
        background: #ffffe0;
        border-color: #eeeeae;
      }
    }

    .ui--SiDropdown {
      width: 6rem;
      text-align: center;
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


    &.accounts-badge {
      background-color: var(--bg-menu) !important;
      color: var(--color-text) !important;
      box-shadow: 0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%);
      z-index: 999;

      &.place-top::after {
        border-top-color: var(--bg-menu) !important;
      }

      &.place-right::after {
        border-right-color: var(--bg-menu) !important;
      }

    a {
      color: #3BBEFF;

      &.purpleColor {
        color: #E6007A;
      }
    }
  }
`;
