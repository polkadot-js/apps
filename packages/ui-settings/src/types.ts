// Copyright 2017-2018 @polkadot/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export type ChainsInfo = Array<{
  name: string,
  chainId: number,
  decimals: number,
  unit: string
}>;

export type Options = Array<{
  disabled?: boolean,
  text: string,
  value: string
}>;

export interface SettingsStruct {
  apiUrl: string;
  i18nLang: string;
  uiMode: string;
  uiTheme: string;
}
