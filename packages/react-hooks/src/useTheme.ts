// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { ThemeDef } from '@polkadot/react-components/types';

import { useContext, useMemo } from 'react';
import { ThemeContext } from 'styled-components';

import { createNamedHook } from './createNamedHook.js';

interface Theme {
  theme: ThemeDef['theme'];
  themeClassName: `theme--${ThemeDef['theme']}`;
}

function useThemeImpl (): Theme {
  const { theme } = useContext(ThemeContext as React.Context<ThemeDef>);

  return useMemo(
    (): Theme => ({
      theme,
      themeClassName: `theme--${theme}`
    }),
    [theme]
  );
}

export const useTheme = createNamedHook('useTheme', useThemeImpl);
