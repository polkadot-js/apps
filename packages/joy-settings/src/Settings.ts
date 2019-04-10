// Copyright 2017-2019 @polkadot/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import store from 'store';

import { CRYPTOS, ENDPOINT_DEFAULT, ENDPOINTS, LANGUAGE_DEFAULT, LANGUAGES, UIMODE_DEFAULT, UIMODES, UITHEME_DEFAULT, UITHEMES } from './defaults';
import { Options, SettingsStruct } from './types';

export class Settings implements SettingsStruct {
  private _apiUrl: string;
  private _i18nLang: string;
  private _uiMode: string;
  private _uiTheme: string;

  constructor () {
    const settings = store.get('settings') || {};

    this._apiUrl = settings.apiUrl || process.env.WS_URL || ENDPOINT_DEFAULT;
    this._i18nLang = settings.i18nLang || LANGUAGE_DEFAULT;
    this._uiMode = settings.uiMode || UIMODE_DEFAULT;
    this._uiTheme = settings.uiTheme || UITHEME_DEFAULT;
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

  get availableNodes (): Options {
    return ENDPOINTS;
  }

  get availableCryptos (): Options {
    return CRYPTOS;
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
