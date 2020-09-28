// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ThemeProps } from '../types';

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

const BRIGHTNESS = 128 + 32;
const FACTORS = [0.2126, 0.7152, 0.0722];
const PARTS = [0, 2, 4];

const defaultHighlight = '#f19135'; // '#f19135'; // #999

function getHighlight ({ uiHighlight }: Props): string {
  return (uiHighlight || defaultHighlight);
}

function getContrast (props: Props): string {
  const hc = getHighlight(props).replace('#', '').toLowerCase();
  const brightness = PARTS.reduce((b, p, index) => b + (parseInt(hc.substr(p, 2), 16) * FACTORS[index]), 0);

  return brightness > BRIGHTNESS
    ? 'rgba(45, 43, 41, 0.875)'
    : 'rgba(255, 253, 251, 0.875)';
}

export default createGlobalStyle<Props & ThemeProps>`
  .highlight--all {
    background: ${getHighlight} !important;
    border-color: ${getHighlight} !important;
    color: ${getHighlight} !important;
  }

  .highlight--before:before {
    background: ${getHighlight} !important;
  }

  .highlight--before-border:before {
    border-color: ${getHighlight} !important;
  }

  .highlight--bg {
    background: ${getHighlight} !important;
  }

  .highlight--bg-contrast {
    background: ${getContrast};
  }

  .highlight--bg-faint,
  .highlight--bg-light {
    background: ${({ theme }) => theme.bgTable};
    position: relative;

    &:before {
      background: ${getHighlight};
      bottom: 0;
      content: ' ';
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      z-index: -1;
    }
  }

  .highlight--bg-faint:before {
    opacity: 0.025;
  }

  .highlight--bg-light:before {
    opacity: 0.125;
  }

  .highlight--border {
    border-color: ${getHighlight} !important;
  }

  .highlight--color {
    color: ${getHighlight} !important;
  }

  .highlight--color-contrast {
    color: ${getContrast};
  }

  .highlight--fill {
    fill: ${getHighlight} !important;
  }

  .highlight--gradient {
    background: ${({ uiHighlight }: Props) => `linear-gradient(90deg, ${uiHighlight || defaultHighlight}, transparent)`};
  }

  .highlight--hover-bg:hover {
    background: ${getHighlight} !important;
  }

  .highlight--hover-color:hover {
    color: ${getHighlight} !important;
  }

  .highlight--icon {
    .ui--Icon {
      color: ${getHighlight} !important;
    }
  }

  .highlight--shadow {
    box-shadow: 0 0 1px ${getHighlight} !important;
  }

  .highlight--stroke {
    stroke: ${getHighlight} !important;
  }

  .ui--Button {
    &:not(.isDisabled):not(.isIcon):not(.isBasic),
    &.withoutLink:not(.isDisabled) {
      .ui--Icon {
        background: ${getHighlight};
        color: ${getContrast};
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
      color: ${getContrast};
      text-shadow: none;

      &:not(.isIcon),
      &.withoutLink {
        .ui--Icon {
          color: inherit;
        }
      }
    }
  }

  .ui--Table td .ui--Button {
    &:not(.isDisabled):not(.isIcon):not(.isToplevel),
    &.withoutLink:not(.isDisabled) {
      &:hover {
        .ui--Icon {
          color: ${getContrast};
        }
      }

      .ui--Icon {
        background: transparent;
        color: ${getHighlight};
      }
    }
  }

  .theme--dark,
  .theme--light {
    .ui--Tabs {
      .ui--Tab.tabLinkActive {
        border-bottom-color: ${getHighlight};
      }
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

    .ui--Toggle.isChecked {
      &:not(.isRadio) {
        .ui--Toggle-Slider {
          background-color: ${getHighlight} !important;

          &:before {
            border-color: ${getHighlight} !important;
          }
        }
      }
    }
  }

  #root {
    background: ${({ theme }) => theme.bgPage};
    color: ${({ theme }) => theme.color};
    font-family: sans-serif;
    height: 100%;
  }

  a {
    cursor: pointer;
  }

  article {
    background: ${({ theme }) => theme.bgTable};
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
      border-left-width: 0.25rem;
      line-height: 1.5;
      margin-left: 2.25rem;
      padding: 0.75rem 1rem;
      position: relative;
      z-index: 5;

      &:before {
        border-radius: 0.25rem;
        bottom: 0;
        content: ' ';
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        z-index: -1;
      }
    }

    &.extraMargin {
      margin: 2rem auto;
    }

    &.centered {
      margin: 1.5rem auto;
      max-width: 75rem;

      &+.ui--Button-Group {
        margin-top: 2rem;
      }
    }

    &.error {
      &:before {
        background: rgba(255, 12, 12, 0.05);
      }

      border-color: rgba(255, 12, 12, 1);
    }

    &.padded {
      padding: 0.75rem 1rem;

      > div {
        margin: 0.25rem;
      }
    }

    &.warning {
      &:before {
        background: rgba(255, 196, 12, 0.05);
      }

      border-color: rgba(255, 196, 12, 1);
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
    color: ${({ theme }) => theme.colorSummary};
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
    color: ${({ theme }) => theme.colorLabel};
    display: block;
    font-family: sans-serif;
    font-size: 1rem;
    font-weight: 100;
  }

  main {
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
