// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Prefix } from '@polkadot/keyring/address/types';

import store from 'store';
import setAddressPrefix from '@polkadot/keyring/address/setPrefix';

export interface SettingsStruct {
  apiUrl: string;
  i18nLang: string;
  uiMode: string;
  uiTheme: string;
}

export type ChainInfo = {
  name: string,
  chainId: number,
  decimals: number
};

type Options = Array<{
  text: string,
  value: string
}>;

const chainInfos: Array<ChainInfo> = [
  {
    name: 'Development',
    chainId: 0,
    decimals: 0
  },
  {
    name: 'BBQ Birch',
    chainId: 68,
    decimals: 15
  }
];

class Settings implements SettingsStruct {
  private _apiUrl: string;
  private _chainPrefix: Prefix;
  private _i18nLang: string;
  private _uiMode: string;
  private _uiTheme: string;

  constructor () {
    const settings = store.get('settings') || {};

    // FIXME Here we have the defaults for BBQ, swap to Polkadot as soon as poc-3 is there
    // FIXME WS_URL first, then substrate-rpc
    this._apiUrl = settings.apiUrl || 'wss://substrate-rpc.parity.io/' || process.env.WS_URL;
    this._chainPrefix = settings.chainPrefix || 68;
    this._i18nLang = settings.i18nLang || 'default';
    this._uiMode = settings.uiMode || process.env.UI_MODE || 'full';
    this._uiTheme = settings.uiTheme || process.env.UI_THEME || 'substrate';

    setAddressPrefix(this._chainPrefix);
  }

  get apiUrl (): string {
    return this._apiUrl;
  }

  get chainInfos (): Array<ChainInfo> {
    return chainInfos;
  }

  get i18nLang (): string {
    return this._i18nLang;
  }

  get uiMode (): string {
    return this._uiMode;
  }

  get uiTheme (): string {
    return this._uiTheme;
  }

  get availableNodes (): Options {
    return [
      { text: 'Local Node (127.0.0.1:9944)', value: 'ws://127.0.0.1:9944/' },
      { text: 'BBQ Birch (hosted by Parity)', value: 'wss://substrate-rpc.parity.io/' }
    ];
  }

  get availableLanguages (): Options {
    return [
      { value: 'default', text: 'Default browser language (auto-detect)' }
    ];
  }

  get availableUIModes (): Options {
    return [
      { value: 'full', text: 'Fully featured' },
      { value: 'light', text: 'Basic features only' }
    ];
  }

  get availableUIThemes (): Options {
    return [
      { value: 'substrate', text: 'Substrate' },
      { value: 'polkadot', text: 'Polkadot' }
    ];
  }

  get (): SettingsStruct {
    return {
      apiUrl: this._apiUrl,
      i18nLang: this._i18nLang,
      uiMode: this._uiMode,
      uiTheme: this._uiTheme
    };
  }

  set (settings: Partial<SettingsStruct>): void {
    this._apiUrl = settings.apiUrl || this._apiUrl;
    this._i18nLang = settings.i18nLang || this._i18nLang;
    this._uiMode = settings.uiMode || this._uiMode;
    this._uiTheme = settings.uiTheme || this._uiTheme;

    store.set('settings', this.get());
  }
}

const settings = new Settings();

export default settings;
