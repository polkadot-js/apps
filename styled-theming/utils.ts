// @ts-nocheck

import deepMerge from 'merge-options';
import { ThemeProps } from './types';

export const createThemeStyle = (themeProps: ThemeProps, defaultThemeStyle: (arg0: ThemeProps) => object): ThemeProps => {
  return deepMerge(
    {},
    defaultThemeStyle(themeProps),
    themeProps.themeStyle,
    themeProps.theme.components[themeProps.themeKey || themeProps.key]
  );
};
