// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '@polkadot/react-components/types';

import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

import { createNamedHook } from './createNamedHook';

type ThemeClassName = `theme--${ThemeDef['theme']}`;

function useThemeImpl (): ThemeClassName {
  const { theme } = useContext(ThemeContext as React.Context<ThemeDef>);

  return `theme--${theme}`;
}

export const useTheme = createNamedHook('useTheme', useThemeImpl);
