// @flow

declare type I18Next$Translate$Config = {
  defaultValue: string,
  replace?: {
    [string]: string
  }
};

declare type I18Next$Translate = (key: string, config: I18Next$Translate$Config) => string;

declare module 'react-i18next' {
  declare module.exports: {
    I18nextProvider: React$StatelessFunctionalComponent<*>,
    Trans: React$StatelessFunctionalComponent<*>,
    reactI18nextModule: {},
    translate: (context: string | Array<string>) => (Component: React$ComponentType<*>) => React$StatelessFunctionalComponent<*>
  }
}
