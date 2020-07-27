// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createGlobalStyle } from 'styled-components';

import cssComponents from './components';
import cssForm from './form';
import cssMedia from './media';
import cssRx from './rx';
import cssSemantic from './semantic';
import cssTheme from './theme';

interface Props {
  uiHighlight?: string;
}

const defaultHighlight = '#f19135'; // #999

const getHighlight = (props: Props): string =>
  (props.uiHighlight || defaultHighlight);

export default createGlobalStyle<Props>`
  .ui--highlight--all {
    background: ${getHighlight} !important;
    border-color: ${getHighlight} !important;
    color: ${getHighlight} !important;
  }

  .ui--highlight--before:before {
    background: ${getHighlight} !important;
  }

  .ui--highlight--bg {
    background: ${getHighlight} !important;
  }

  .ui--highlight--border {
    border-color: ${getHighlight} !important;
  }

  .ui--highlight--color {
    color: ${getHighlight} !important;
  }

  .ui--highlight--fill {
    fill: ${getHighlight} !important;
  }

  .ui--highlight--gradient {
    background: ${(props: Props) => `linear-gradient(90deg, ${props.uiHighlight || defaultHighlight}, transparent)`};
  }

  .ui--highlight--icon {
    .ui--Icon {
      color: ${getHighlight} !important;
    }
  }

  .ui--highlight--stroke {
    stroke: ${getHighlight} !important;
  }

  .ui--Button {
    &:not(.isDisabled):not(.isIcon):not(.isBasic) {
      .ui--Icon {
        background: ${getHighlight};
        color: #f5f5f4;
      }
    }

    &.isBasic:not(.isDisabled):not(.isIcon):not(.isSelected) {
      &:not(.isReadOnly) {
        box-shadow: 0 0 1px ${getHighlight};
      }

      .ui--Icon {
        color: ${getHighlight};
      }
    }

    &.isSelected {
      box-shadow: 0 0 1px ${getHighlight};
    }

    &:hover:not(.isDisabled):not(.isReadOnly),
    &.isSelected {
      background: ${getHighlight};
      color: #f5f5f4;
      text-shadow: none;

      &:not(.isIcon) {
        .ui--Icon {
          color: inherit;
        }
      }
    }
  }

  .ui--Table td .ui--Button {
    &:not(.isDisabled):not(.isIcon) {
      .ui--Icon {
        background: transparent;
        color: ${getHighlight};
      }
    }
  }

  .theme--default {
    .ui--Tabs-Tab.tabLinkActive {
      border-bottom-color: ${getHighlight};
    }

    .ui.negative.button,
    .ui.buttons .negative.button {
      background: #666 !important;
    }

    .ui.primary.button,
    .ui.buttons .primary.button {
      background: ${getHighlight};

      &.active,
      &:active,
      &:focus,
      &:hover {
        background-color: ${getHighlight};
      }
    }

    .ui--Toggle.isChecked .ui--Toggle-Slider {
      background-color: ${getHighlight} !important;

      &:before {
        border-color: ${getHighlight} !important;
      }
    }
  }

  #root {
    color: #4e4e4e;
    font-family: sans-serif;
    height: 100%;
  }

  a {
    cursor: pointer;
  }

  article {
    background: white;
    border: 1px solid #f2f2f2;
    border-radius: 0.25rem;
    box-sizing: border-box;
    margin: 0.25rem;
    padding: 1.25rem;
    position: relative;
    text-align: left;

    > ul {
      margin: 0;
      padding: 0;
    }

    &.error,
    &.warning {
      font-size: 0.95rem;
      margin-left: 2.25rem;
      padding: 0.75rem 1rem;
    }

    &.nomargin {
      margin-left: 0;
    }

    &.error {
      background: #fff6f6;
      border-color: #e0b4b4;
      color: #9f3a38;
    }

    &.padded {
      padding: 0.75rem 1rem;

      > div {
        margin: 0.25rem;
      }
    }

    &.warning {
      background: #ffffe0;
      border-color: #eeeeae;
    }
  }

  body {
    height: 100%;
    margin: 0;
  }

  br {
    line-height: 1.5rem;
  }

  details {
    cursor: pointer;

    &[open] > summary {
      white-space: normal;

      br, br + * {
        display: block;
      }
    }

    > summary {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      outline: none;

      br, br + * {
        display: none;
      }
    }
  }

  h1, h2, h3, h4, h5 {
    color: rgba(0, 0, 0, .6);
    font-family: sans-serif;
    font-weight: 100;
  }

  h1 {
    text-transform: lowercase;

    em {
      font-style: normal;
      text-transform: none;
    }
  }

  h1, h2, h3, h4, h5 {
    margin-bottom: 0.25rem;
  }

  header {
    margin-bottom: 1.5rem;
    text-align: center;

    > article {
      background: transparent;
    }
  }

  html {
    height: 100%;
  }

  label {
    box-sizing: border-box;
    color: rgba(78, 78, 78, .66);
    display: block;
    font-family: sans-serif;
    font-size: 1rem;
    font-weight: 100;
  }

  main {
    min-height: 100vh;

    > section {
      margin-bottom: 2em;
    }
  }

  /* Add our overrides */
  ${cssSemantic}
  ${cssTheme}
  ${cssForm}
  ${cssMedia}
  ${cssRx}
  ${cssComponents}
`;
