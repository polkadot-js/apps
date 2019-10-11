// Copyright 2017-2019 @polkadot/react-components authors & contributors
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
      border-color: #eee;
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

    &.disabled {
      opacity: 1;

      input {
        background: transparent;
        border-color: #eee;
        border-style: dashed;
      }

      .ui.primary.buttons .ui.button {
        background: #eee;
        border-color: transparent;
        border-left-color: transparent;
        color: #4e4e4e;

        .dropdown.icon {
          opacity: 0;
        }
      }
    }

    > input {
      width: 0;
    }
  }

  .ui.inverted.dimmer {
    background-color: rgba(255, 255, 255, 0.75);
    padding: 0 1rem 1rem;
  }

  .ui.label:not(.ui--Bubble) {
    background: transparent;
    font-weight: normal;
    position: relative;
    z-index: 1;
  }

  .ui.modal {
    background: #fafafa;
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

    > .header:not(.ui) {
      background: #f5f5f5;
      font-size: 1.25rem !important;
      font-weight: normal;
      line-height: 1.25rem;
      padding: 1rem 1.5rem;

      > label {
        margin-top: 0.5rem;
      }
    }

    > :first-child:not(.icon) {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
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

  /* modals aligned to top, not center */
  .ui.dimmer {
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
