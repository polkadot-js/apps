// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '@polkadot/react-components/types';

export const darkTheme: ThemeDef = {
  bgInput: '#38393f',
  bgInputError: '#48393f',
  bgInverse: 'rgba(78, 78, 78, 0.66)',
  bgMenu: '#26272c',
  bgMenuHover: 'rgba(255, 255, 255, 0.05)',
  bgTable: '#3b3d3f',
  bgTabs: '#3b3d3f',
  bgToggle: '#58595f',
  borderTable: '#343536',
  borderTabs: '#343536',
  color: 'rgba(244, 242, 240, 0.9)',
  colorCheckbox: 'rgba(78, 78, 78, 0.66)',
  colorError: 'rgba(255, 83, 83, 0.8)',
  colorLabel: 'rgba(244, 242, 240, 0.45)',
  colorSummary: 'rgba(244, 242, 240, 0.75)',
  theme: 'dark'
};

export const lightTheme: ThemeDef = {
  bgInput: '#ffffff',
  bgInputError: '#fff6f6',
  bgInverse: 'rgba(244, 242, 240, 0.91)',
  bgMenu: '#fff',
  bgMenuHover: 'rgba(255, 255, 255, 0.5)',
  bgTable: '#fff',
  bgTabs: '#fff',
  bgToggle: '#e4e5e6',
  borderTable: '#f1efed',
  borderTabs: '#f1efed',
  color: '#4e4e4e',
  colorCheckbox: 'rgba(34, 36, 38, 0.15)',
  colorError: 'rgba(139, 0, 0)',
  colorLabel: 'rgba(78,78,78,0.66)',
  colorSummary: 'rgba(0, 0, 0, 0.6)',
  theme: 'light'
};
