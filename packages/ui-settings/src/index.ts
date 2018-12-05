// Copyright 2017-2018 @polkadot/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import store from 'store';

import { CHAINS, ENDPOINTS, LANGUAGES, UIMODES, UITHEMES } from './defaults';
import { ChainsInfo, Options, SettingsStruct } from './types';

class Settings implements SettingsStruct {
  private _apiUrl: string;
  private _i18nLang: string;
  private _uiMode: string;
  private _uiTheme: string;

  constructor () {
    const settings = store.get('settings') || {};

    // FIXME Here we have the defaults for BBQ, swap to Polkadot as soon as poc-3 is there
    // FIXME WS_URL first, then substrate-rpc
    this._apiUrl = settings.apiUrl || ENDPOINTS[0].value || process.env.WS_URL;
    this._i18nLang = settings.i18nLang || LANGUAGES[0].value;
    this._uiMode = settings.uiMode || process.env.UI_MODE || UIMODES[0].value;
    this._uiTheme = settings.uiTheme || process.env.UI_THEME || UITHEMES[0].value;
  }

  get apiUrl (): string {
    return this._apiUrl;
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

  get availableChains (): ChainsInfo {
    return CHAINS;
  }

  get availableNodes (): Options {
    return ENDPOINTS;
  }

  get availableLanguages (): Options {
    return LANGUAGES;
  }

  get availableUIModes (): Options {
    return UIMODES;
  }

  get availableUIThemes (): Options {
    return UITHEMES;
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
