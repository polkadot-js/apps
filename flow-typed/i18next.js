// @flow

declare type I18Next$Config = {
  fallbackLng?: string,
  ns?: Array<string>,
  defaultNS?: string,
  debug?: boolean,
  interpolation?: {
    escapeValue: boolean
  },
  react?: {
    wait: boolean
  }
};

declare module 'i18next' {
  declare type I18Next = {
    use: (any) => I18Next,
    init: (I18Next$Config) => I18Next
  };

  declare module.exports: I18Next
}
