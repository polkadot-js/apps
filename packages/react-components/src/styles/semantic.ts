// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { css } from 'styled-components';

export default css`
  .ui.hidden.divider {
    margin: 0.5rem 0;
  }

  .ui.dropdown {
    display: block;
    min-width: 0;
    width: 100%;
  }

  .ui.dropdown,
  .ui.input {
    margin: 0.25rem 0;
  }

  .ui.selection.dropdown,
  .ui.input > input {
    color: inherit;
  }

  .ui.dropdown {
    &.disabled {
      background: transparent;
      border-style: dashed;
      opacity: 1;

      .dropdown.icon {
        opacity: 0;
      }
    }

    > .text {
      min-height: 1em;
    }
  }

  .ui.dropdown .menu > .item.header.disabled {
    margin: 1em 0 0 0;
    opacity: 1;
  }

  .ui.dropdown .menu > .item.header.disabled:hover,
  .ui.dropdown .menu > .item.header.disabled.selected {
    background: white;
  }

  .ui.input {
    width: 100%;

    &.disabled:not(.retain-appearance) {
      opacity: 1;

      input {
        background: transparent;
        border-style: dashed;
      }

      .ui.primary.buttons .ui.button {
        background-color: #666;
        border-color: transparent;
        border-left-color: transparent;
        color: #f9f9f9;
        opacity: 0.5;

        .dropdown.icon {
          opacity: 0;
        }
      }
    }

    &.disabled.error input {
      background-color: #fff6f6;
      border-color: #e0b4b4;
    }

    > input {
      width: 0;
    }
  }

  .ui.label:not(.ui--Bubble) {
    background: transparent;
    font-weight: normal;
    position: relative;
    z-index: 1;
  }

  .ui.modal {
    background: #f9f9f9;
    box-shadow: none;
    color: #4e4e4e;
    font-family: sans-serif;

    > .actions,
    > .content {
      background: transparent;
    }

    > .actions {
      border-top: none;
      text-align: right;
      padding: 1rem !important;
    }

    /* approx h1, color, size, font */
    > .header:not(.ui) {
      background: #f9f9f9;
      border-bottom: none;
      color: rgba(0, 0, 0, .6);
      font-family: sans-serif;
      font-size: 1.75rem;
      font-weight: 100;
      line-height: 1.25rem;
      padding: 1.5rem 1.75rem 0;
      text-transform: lowercase;

      > label {
        margin-top: 0.5rem;
      }
    }

    .description {
      margin: 1.5em 0;
      font-weight: 700;
    }
  }

  .ui.page.modals.transition.visible {
    display: flex !important;
  }

  .ui.progress {
    &.tiny {
      font-size: .5rem;
    }

    .bar {
      min-width: 0 !important;
    }
  }

  .ui.secondary.vertical.menu > .item {
    margin: 0;
  }

  .ui[class*="left icon"].input.left.icon > input {
    padding-left: 4rem !important;
  }

  .ui[class*="left icon"].input.left.icon > i.icon.big {
    left: -7px;
    opacity: 1;
  }

  .ui.button:disabled,
  .ui.buttons .disabled.button,
  .ui.disabled.active.button,
  .ui.disabled.button,
  .ui.disabled.button:hover {
    opacity: 0.2 !important;
  }

  .ui.button+.ui.button {
    margin-left: 0.5rem;
  }

  /* modals aligned to top, not center */
  .ui.dimmer {
    background-color: rgba(0,0,0,0.5);
    justify-content: flex-start;
  }

  .ui.menu.tabular {
    border-color: #e6e6e6;
    /* break out of the wrapping main padding */
    margin: -1em -2em 0;
    overflow-x: scroll;
    padding: 2em 2em 0 2em;
    transition: padding-left 0.2s linear 0.4s;

    &::-webkit-scrollbar {
      display: none;
      width: 0px;
    }

    .item {
      border-bottom: 2px solid rgba(0, 0, 0, 0);
      border: none;
      top: -1px;

      &.active {
        background: none;;
        border-bottom: 2px solid #db2828;
      }
    }
  }

  /* remove the default white background, settings app has it as part of Tab */
  .ui.segment {
    background: transparent;
  }
`;
