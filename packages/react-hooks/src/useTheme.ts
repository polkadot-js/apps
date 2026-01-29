// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '@polkadot/react-components/types';

import { useContext, useMemo } from 'react';
import { ThemeContext } from 'styled-components';

import { createNamedHook } from './createNamedHook.js';

interface Theme {
  theme: ThemeDef['theme'];
  themeClassName: `theme--${ThemeDef['theme']}`;
}

function useThemeImpl (): Theme {
  const ctx = useContext(ThemeContext);

  return useMemo(
    (): Theme => ({
      theme: (ctx?.theme || 'light') as 'light',
      themeClassName: `theme--${(ctx?.theme || 'light') as 'light'}`
    }),
    [ctx]
  );
}

export const useTheme = createNamedHook('useTheme', useThemeImpl);
