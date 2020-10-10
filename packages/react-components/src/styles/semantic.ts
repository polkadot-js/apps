// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { css } from 'styled-components';
import { ELEV_1_CSS, ELEV_2_CSS, ELEV_3_CSS } from './constants';

export default css`
  .ui.hidden.divider {
    margin: 0.5rem 0;
  }

  .ui.action.input:not([class*="left action"]) > input:focus {
    border-right-color: var(--blue-primary) !important;
  }

  .ui.action.input.error:not([class*="left action"]) > input {
    border-right-color: var(--red-primary) !important;
  }

  .ui.button {
    border-radius: 0.1875rem;
    font-family: var(--default-font-family, sans-serif);
    font-weight: normal;
    padding: 0.375rem 0.75rem;
    font-weight: normal;
    transition: all .1s ease;
  }

  .ui.checkbox {
    + label {
      &, &:hover {
        color: var(--grey50);
      }
    }

    &.toggle .box:hover::before, &.toggle label:hover::before {
      background: var(--grey30);
    }

    &.toggle .box:before, &.toggle label:before {
      background: var(--grey30);
    }

    &.toggle input:focus~.box:before, &.toggle input:focus~label:before {
      background: var(--grey30);
    }
  }

  .ui.dropdown {
    display: block;
    min-width: 0;
    width: 100%;
  }

  // .ui.dropdown,
  // .ui.input {
  //   margin: 0.25rem 0;
  // }

  .ui.input {
    > input, > input:focus {
      font-family: var(--default-font-family, sans-serif);
      color: var(--grey80);
      ${ELEV_2_CSS}
    }

    > input:focus {
      border: 1px solid var(--blue-primary);
    }

    &.error {
      > input {
        background: var(--grey15);
        border: 1px solid var(--red-primary);
      }
    }
  }

  .ui.selection.dropdown {
    ${ELEV_2_CSS}
    color: var(--grey80);
    border: 1px solid var(--grey20);

    > .delete.icon, > .dropdown.icon, > .search.icon {
      font-size: 1rem;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }

  .ui.dropdown {
    &.disabled {
      color: var(--grey50);
      opacity: 1;
      background: transparent;

      .dropdown.icon {
        display: none;
      }
    }

    > .text {
      min-height: 1em;
    }

    .menu {
      ${ELEV_1_CSS}

      > .message:not(.ui) {
        color: inherit;
      }
    }
  }

  .ui.dropdown .menu > .item.header.disabled {
    margin: 1em 0 0 0;
    opacity: 1;
  }

  .ui.dropdown .menu > .item {
    border-radius: 0 !important;
    font-size: 0.875rem;
  }

  .ui.dropdown .menu .selected.item {
    ${ELEV_2_CSS}
  }

  .ui.dropdown .menu > .header {
    color: var(--grey80);
  }

  .ui.loader {
    &:before {
      border-color: var(--grey30) !important;
    }
  }

  .ui.progress {
    background-color: var(--grey30);
  }

  .ui.green.progress .bar {
    background-color: var(--green-primary);
  }

  .ui.red.progress .bar {
    background-color: var(--red-primary);
  }

  .ui.selection.active.dropdown {
    &, &:hover {
      border-color: var(--blue-primary);

      .menu {
        &, &:hover {
          border-color: var(--blue-primary);
        }
      }
    }
  }

  .ui.selection.visible.dropdown>.text:not(.default) {
    color: var(--grey80);
  }

  .ui.selection.dropdown .menu > .item {
    &, &:hover {
      border-top: 0;
      color: var(--grey80);
    }

    &:hover {
      ${ELEV_3_CSS}
    }
  }

  .ui.dropdown .menu .selected.item {
    color: var(--grey80);
  }

  // .ui.dropdown .menu > .item.header.disabled:hover,
  // .ui.dropdown .menu > .item.header.disabled.selected {
  //   background: white;
  // }

  .ui.input {
    flex-grow: 1;

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
        color: #f9f8f7;
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
    ${ELEV_3_CSS}
    box-shadow: none;
    font-family: var(--default-font-family, sans-serif);;
    max-width: 572px;

    > .actions,
    > .content {
      background: transparent;
    }

    > .actions {
      border-top: none;
      text-align: right;
      padding: 0 1.5rem 1.5rem;
    }

    /* approx h1, color, size, font */
    > .header:not(.ui) {
      background: transparent;
      border-bottom: none;
      font-family: var(--default-font-family, sans-serif);;
      font-size: 1.5rem;
      font-weight: normal;
      line-height: 1.25rem;
      padding: 1.5rem 1.75rem 0;

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

  .ui.menu {
    font-family: var(--default-font-family, sans-serif);;
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

  .ui.vertical.menu {
    width: 100%;
  }
`;
