// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_theme: ThemeDef): string => `
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
  .ui.input > input,
  .ui.selection.dropdown > input {
    background: var(--bg-input);
    color: var(--color-text);
    font: var(--font-sans);
    font-size: 1rem;

    &:focus {
      background: var(--bg-input);
      color: var(--color-text);
    }
  }

  .ui.action.input > .buttons {
    position: relative;
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

    &.selection.visible {
      background: var(--bg-input);
      color: var(--color-text);
    }

    .menu {
      background: var(--bg-input);
      color: var(--color-text);

      > .item {
        border-color: transparent !important;
        color: var(--color-text) !important;

        &.header.disabled {
          margin: 1em 0 0 0;
          opacity: 1;

          &:hover,
          &.selected {
            background: var(--bg-input);
          }
        }
      }
    }

    > .text {
      min-height: 1em;

      &:not(.default) {
        color: var(--color-text) !important;
      }
    }
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
        color: #f9f8f7;
        opacity: 0.5;

        .dropdown.icon {
          opacity: 0;
        }
      }
    }

    &.error input {
      background-color: var(--bg-input-error);
      border-color: #e0b4b4;
    }

    > input {
      width: 0;
    }
  }

  .ui.label {
    background: transparent;
    font-weight: var(--font-weight-normal);
    position: relative;
    z-index: 1;
  }

  .ui.modal {
    background: var(--bg-page);
    box-shadow: none;
    color: var(--color-text);
    font: var(--font-sans);

    > .actions,
    > .content {
      background: transparent;
    }

    > .actions {
      border-top: none;
      text-align: right;
      padding: 0 1rem !important;
    }

    /* approx h1, color, size, font */
    > .header:not(.ui) {
      background: transparent;
      border-bottom: none;
      color: var(--color-summary);
      font: var(--font-sans);
      font-size: 1.75rem;
      font-weight: var(--font-weight-normal);
      line-height: 1.25rem;
      padding: 0.75rem 1.5rem 0;
      text-transform: lowercase;

      > label {
        margin-top: 0.5rem;
      }

      > h1 {
        line-height: 1;
      }
    }

    .description {
      margin: 1.5em 0;
      font-weight: var(--font-weight-normal);
    }
  }

  .ui.page.modals.transition.visible {
    display: flex !important;
  }

  .ui.popup {
    background: var(--bg-menu);
    color: var(--color-text);

    .ui.text.menu .item {
      color: var(--color-text) !important;

      &.disabled {
        opacity: 0.3;
      }
    }

    &&::before {
      background: var(--bg-menu);
    }
  }

  .ui.secondary.vertical.menu > .item {
    margin: 0;
  }

  .ui[class*="left icon"].input.left.icon > input {
    padding-left: 4rem !important;
  }

  .ui[class*="left icon"].input.left.icon > .ui--Icon.big {
    left: -7px;
    opacity: 1;
  }

  /* modals aligned to top, not center */
  .ui.dimmer {
    background-color: rgba(96, 96, 96, 0.5);
    justify-content: flex-start;
  }

  /* remove the default white background, settings app has it as part of Tab */
  .ui.segment {
    background: transparent;
  }
`;
