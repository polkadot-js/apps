// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '@polkadot/react-components/types';

// Fonts as found on https://newcss.net/
const FONT = {
  fontMono: '0.9em Consolas, monaco, "Ubuntu Mono", "Liberation Mono", "Courier New", Courier, monospace',
  fontSans: '1em "-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontWeightLight: 200,
  fontWeightNormal: 400
};

export const darkTheme: ThemeDef = {
  ...FONT,
  bgInput: '#38393f',
  bgInputError: '#48393f',
  bgInverse: 'rgba(78, 78, 78, 0.66)',
  bgMenu: '#26272c',
  bgMenuHover: 'rgba(255, 255, 255, 0.05)',
  bgPage: '#26272c',
  bgTable: '#38393f',
  bgTabs: '#38393f',
  bgToggle: '#58595f',
  borderTable: 'transparent',
  borderTabs: 'transparent',
  color: 'rgba(244, 242, 240, 0.9)',
  colorCheckbox: 'rgba(78, 78, 78, 0.66)',
  colorError: 'rgba(255, 0, 0, 0.85)',
  colorLabel: 'rgba(244, 242, 240, 0.45)',
  colorSummary: 'rgba(244, 242, 240, 0.75)',
  theme: 'dark'
};

export const lightTheme: ThemeDef = {
  ...FONT,
  bgInput: '#fff',
  bgInputError: '#fff6f6',
  bgInverse: 'rgba(244, 242, 240, 0.91)',
  bgMenu: '#fff',
  bgMenuHover: 'rgba(255, 255, 255, 0.5)',
  bgPage: '#f5f3f1',
  bgTable: '#fff',
  bgTabs: '#fff',
  bgToggle: '#e4e5e6',
  borderTable: '#eeecea',
  borderTabs: '#eeecea',
  color: '#4e4e4e',
  colorCheckbox: 'rgba(34, 36, 38, 0.15)',
  colorError: 'rgba(139, 0, 0)',
  colorLabel: 'rgba(78, 78, 78, 0.66)',
  colorSummary: 'rgba(0, 0, 0, 0.6)',
  theme: 'light'
};
