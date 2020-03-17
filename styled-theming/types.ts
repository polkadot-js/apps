export type StyledTheme = {
  colors: any;
  components: object;
  utils: any;
};

export type ThemeProps = {
  theme: StyledTheme;
  key?: string;
  themeKey?: string;
  themeStyle?: object;
};
