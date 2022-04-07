// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

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
const VERY_DARK = 16;

const defaultHighlight = '#f19135'; // '#f19135'; // #999

function getHighlight (uiHighlight: string | undefined): string {
  return (uiHighlight || defaultHighlight);
}

function countBrightness (uiHighlight: string | undefined): number {
  const hc = getHighlight(uiHighlight).replace('#', '').toLowerCase();

  return PARTS.reduce((b, p, index) => b + (parseInt(hc.substr(p, 2), 16) * FACTORS[index]), 0);
}

function getContrast (uiHighlight: string | undefined): string {
  const brightness = countBrightness(uiHighlight);

  return brightness > BRIGHTNESS
    ? 'rgba(45, 43, 41, 0.875)'
    : 'rgba(255, 253, 251, 0.875)';
}

function getMenuHoverContrast (uiHighlight: string | undefined): string {
  const brightness = countBrightness(uiHighlight);

  if (brightness < VERY_DARK) {
    return 'rgba(255, 255, 255, 0.15)';
  }

  return brightness < BRIGHTNESS
    ? 'rgba(0, 0, 0, 0.15)'
    : 'rgba(255, 255, 255, 0.15)';
}

function hexToRGB (hex: string, alpha?: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return alpha
    ? `rgba(${r}, ${g}, ${b}, ${alpha})`
    : `rgb(${r}, ${g}, ${b})`;
}

export default createGlobalStyle<Props & ThemeProps>(({ theme, uiHighlight }: Props & ThemeProps) => `
  .highlight--all {
    background: ${getHighlight(uiHighlight)} !important;
    border-color: ${getHighlight(uiHighlight)} !important;
    color: ${getHighlight(uiHighlight)} !important;
  }

  .highlight--before:before {
    background: ${getHighlight(uiHighlight)} !important;
  }

  .highlight--before-border:before {
    border-color: ${getHighlight(uiHighlight)} !important;
  }

  .highlight--bg {
    background: ${getHighlight(uiHighlight)} !important;
  }

  .highlight--bg-contrast {
    background: ${getContrast(uiHighlight)};
  }

  .ui--MenuItem.isActive .ui--Badge {
    background: ${getHighlight(uiHighlight)};
    color: ${getContrast(uiHighlight)} !important;
  }

  .ui--MenuItem {
    & .ui--Badge {
      color: ${countBrightness(uiHighlight) < BRIGHTNESS ? '#fff' : '#424242'};
    }

    &:hover:not(.isActive) .ui--Badge {
      background: ${countBrightness(uiHighlight) < BRIGHTNESS ? 'rgba(255, 255, 255, 0.8)' : '#4D4D4D'};
      color: ${countBrightness(uiHighlight) > BRIGHTNESS ? '#fff' : '#424242'};
    }
  }

  .ui--Tab .ui--Badge {
    background: ${getHighlight(uiHighlight)};
    color: ${countBrightness(uiHighlight) < BRIGHTNESS ? '#fff' : '#424242'};
  }

  .highlight--bg-faint,
  .highlight--bg-light {
    background: var(--bg-table);
    position: relative;

    &:before {
      background: ${getHighlight(uiHighlight)};
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
    opacity: 0.2;
  }

  .highlight--border {
    border-color: ${getHighlight(uiHighlight)} !important;
  }

  .highlight--color {
    color: ${getHighlight(uiHighlight)} !important;
  }

  .highlight--color-contrast {
    color: ${getContrast(uiHighlight)};
  }

  .highlight--fill {
    fill: ${getHighlight(uiHighlight)} !important;
  }

  .highlight--gradient {
    background: ${`linear-gradient(90deg, ${uiHighlight || defaultHighlight}, transparent)`};
  }

  .ui--MenuItem.topLevel:hover,
  .ui--MenuItem.isActive.topLevel:hover {
    color: ${getContrast(uiHighlight)};

    a {
      background-color: ${getMenuHoverContrast(uiHighlight)};
    }
  }

  .menuItems li:hover .groupHdr {
    background: ${getMenuHoverContrast(uiHighlight)};
    color: ${getContrast(uiHighlight)};
  }

  .groupMenu {
    background: ${getHighlight(uiHighlight)} !important;

    &::before {
      background: ${getMenuHoverContrast(uiHighlight)};
      color:  ${getContrast(uiHighlight)};
    }
    li {
      color:  ${getContrast(uiHighlight)};
    }
  }

  .highlight--hover-bg:hover {
    background: ${getHighlight(uiHighlight)} !important;
  }

  .highlight--hover-color:hover {
    color: ${getHighlight(uiHighlight)} !important;
  }

  .highlight--icon {
    .ui--Icon {
      color: ${getHighlight(uiHighlight)} !important;
    }
  }

  .highlight--shadow {
    box-shadow: 0 0 1px ${getHighlight(uiHighlight)} !important;
  }

  .highlight--stroke {
    stroke: ${getHighlight(uiHighlight)} !important;
  }

  .ui--Button {
    &:not(.isDisabled):not(.isIcon):not(.isBasic),
    &.withoutLink:not(.isDisabled) {
      .ui--Icon {
        background: ${getHighlight(uiHighlight)};
        color: ${getContrast(uiHighlight)};
      }
    }

    &.isBasic:not(.isDisabled):not(.isIcon):not(.isSelected) {
      &:not(.isReadOnly) {
        box-shadow: 0 0 1px ${getHighlight(uiHighlight)};
      }

      .ui--Icon {
        color: ${getHighlight(uiHighlight)};
      }
    }

    &.isSelected {
      box-shadow: 0 0 1px ${getHighlight(uiHighlight)};
    }

    &:hover:not(.isDisabled):not(.isReadOnly),
    &.isSelected {
      background: ${getHighlight(uiHighlight)};
      color: ${getContrast(uiHighlight)};
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
          color: ${getContrast(uiHighlight)};
        }
      }

      .ui--Icon {
        background: transparent;
        color: inherit;
        color: ${getHighlight(uiHighlight)};
      }
    }
  }

  .ui--Popup .ui--Button.isOpen:not(.isDisabled):not(.isReadOnly) {
    background: ${getHighlight(uiHighlight)} !important;
    color: ${getContrast(uiHighlight)} !important;

    .ui--Icon {
      background: transparent !important;
      color: ${getContrast(uiHighlight)} !important;
    }
  }


  .ui--Menu {
    .ui--Menu__Item:hover {
       background: ${hexToRGB(getHighlight(uiHighlight), '.1')};
    }

    .ui--Toggle.isChecked .ui--Toggle-Slider {
      background: ${getHighlight(uiHighlight)};

      &::before {
        border-color: ${getHighlight(uiHighlight)};
      }
    }
  }

  .ui--Sort {
    .ui--Labelled.ui--Dropdown:hover {
     .ui.selection.dropdown {
        border-color: ${getHighlight(uiHighlight)};

       .visible.menu {
         border: 1px solid ${getHighlight(uiHighlight)};
        }
      }
    }

    button:hover {
      border-color: ${getHighlight(uiHighlight)};
    }

    button:hover,
    .ui--Labelled.ui--Dropdown:hover {
      &::after {
        background-color:  ${getHighlight(uiHighlight)};
      }
    }

    .arrow.isActive {
      color:  ${getHighlight(uiHighlight)};
      opacity: 1;
    }
  }

  .theme--dark,
  .theme--light {
    .ui--Tabs .tabLinkActive .tabLinkText::after{
        background: ${getHighlight(uiHighlight)};
    }

    .ui.primary.button,
    .ui.buttons .primary.button {
      background: ${getHighlight(uiHighlight)};

      &.active,
      &:active,
      &:focus,
      &:hover {
        background-color: ${getHighlight(uiHighlight)};
      }
    }

    .ui--Toggle.isChecked {
      &:not(.isRadio) {
        .ui--Toggle-Slider {
          background: ${getHighlight(uiHighlight)} !important;

          &:before {
            border-color: ${getHighlight(uiHighlight)} !important;
          }
        }
      }
    }
  }

  .ui--ExpandButton:hover {
    border-color: ${getHighlight(uiHighlight)} !important;

    .ui--Icon {
      color: ${getHighlight(uiHighlight)} !important;
    }
  }

  .ui--Tag.themeColor.lightTheme,
  .ui--InputTags.lightTheme .ui.label {
    background: ${hexToRGB(getHighlight(uiHighlight), '0.08')};
    color: ${countBrightness(uiHighlight) > BRIGHTNESS ? '#424242' : getHighlight(uiHighlight)};
  }

  .ui--Tag.themeColor.darkTheme,
  .ui--InputTags.darkTheme .ui.label {
    color: ${countBrightness(uiHighlight) > BRIGHTNESS ? getHighlight(uiHighlight) : '#fff'};
  }

  #root {
    background: var(--bg-page);
    color: var(--color-text);
    font: var(--font-sans);
    height: 100%;
  }

  a {
    cursor: pointer;
  }

  article {
    background: var(--bg-table);
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

    &.mark {
      margin: 0.5rem 0 0.5rem 2.25rem;
      padding: 0.5rem 1rem !important;
    }

    &.nomargin {
      margin-left: 0;
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
    font: var(--font-sans);
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
    color: var(--color-summary);
    font: var(--font-sans);
    font-weight: var(--font-weight-light);
    margin-bottom: 0.25rem;
  }

  h1 {
    font-size: 1.75rem;
    text-transform: lowercase;

    em {
      font-style: normal;
      text-transform: none;
    }
  }

  h2 {
    font-size: 1.71428571rem;
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
    color: var(--color-label);
    display: block;
    font: var(--font-sans);
    font-size: 1rem;
    font-weight: var(--font-weight-normal);
  }

  main {
    > section {
      margin-bottom: 2em;
    }
  }

  /* Add our overrides */
  ${cssSemantic(theme)}
  ${cssTheme}
  ${cssForm}
  ${cssMedia}
  ${cssRx}
  ${cssComponents(theme)}
`);
