// Copyright 2017-2018 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SettingsStruct } from '@polkadot/ui-settings/types';

import React from 'react';
import store from 'store';
import typeRegistry from '@polkadot/types/codec/typeRegistry';
import { Button, Dropdown, InputFile } from '@polkadot/ui-app/index';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import settings from '@polkadot/ui-settings';
import { u8aToString } from '@polkadot/util';

import './index.css';

import translate from './translate';

type Props = I18nProps & {
  basePath: string,
  onStatusChange: (status: ActionStatus) => void
};

type State = SettingsStruct & {
  types?: { [index: string]: any } | null,
  typesError?: boolean,
  typesPlaceholder?: string
};

class App extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const types = store.get('types') || {};
    const names = Object.keys(types);
    const state = settings.get();

    this.state = {
      ...state,
      typesPlaceholder: names.length
        ? names.join(', ')
        : undefined
    };
  }

  render () {
    const { t } = this.props;
    const { apiUrl, i18nLang, typesPlaceholder, typesError, uiMode, uiTheme } = this.state;

    return (
      <main className='settings--App'>
        <section>
          <h1>{t('settings.general', {
            defaultValue: 'general'
          })}</h1>
          <div className='ui--row'>
            <div className='full'>
              <Dropdown
                defaultValue={apiUrl}
                label={t('select.api.url', {
                  defaultValue: 'remote node/endpoint to connect to'
                })}
                onChange={this.onChangeApiUrl}
                options={settings.availableNodes}
              />
            </div>
          </div>
          <div className='ui--row'>
            <div className='medium'>
              <Dropdown
                defaultValue={uiTheme}
                label={t('select.ui.theme', {
                  defaultValue: 'default interface theme'
                })}
                onChange={this.onChangeUiTheme}
                options={settings.availableUIThemes}
              />
            </div>
            <div className='medium'>
              <Dropdown
                defaultValue={uiMode}
                label={t('select.ui.mode', {
                  defaultValue: 'interface operation mode'
                })}
                onChange={this.onChangeUiMode}
                options={settings.availableUIModes}
              />
            </div>
          </div>
          <div className='ui--row'>
            <div className='full'>
              <Dropdown
                defaultValue={i18nLang}
                isDisabled
                label={t('select.i18n.lang', {
                  defaultValue: 'default interface language'
                })}
                onChange={this.onChangeLang}
                options={settings.availableLanguages}
              />
            </div>
          </div>
        </section>
        <section>
          <h1>{t('settings.developer', {
            defaultValue: 'developer'
          })}</h1>
          <div className='ui--row'>
            <div className='full'>
              <InputFile
                isError={typesError}
                label='additional type definitions (JSON)'
                onChange={this.onChangeTypes}
                placeholder={typesPlaceholder}
              />
            </div>
          </div>
        </section>
        <Button.Group>
          <Button
            isPrimary
            onClick={this.save}
            text={t('btn.do', {
              defaultValue: 'Save & Reload'
            })}
          />
        </Button.Group>
      </main>
    );
  }

  private onChangeApiUrl = (apiUrl: string): void => {
    this.setState({ apiUrl });
  }

  private onChangeLang = (i18nLang: string): void => {
    // ignore (for now), here to future-proof
  }

  private onChangeTypes = (data: Uint8Array) => {
    try {
      const types = JSON.parse(u8aToString(data));
      const typesPlaceholder = Object.keys(types).join(', ');

      console.log('Registering types:', typesPlaceholder);

      typeRegistry.register(types);

      this.setState({
        types,
        typesError: false,
        typesPlaceholder
      });
    } catch (error) {
      console.error('Registering types:', error);

      this.setState({
        types: null,
        typesError: true,
        typesPlaceholder: error.message
      });
    }
  }

  private onChangeUiMode = (uiMode: string): void => {
    this.setState({ uiMode });
  }

  private onChangeUiTheme = (uiTheme: string): void => {
    this.setState({ uiTheme });
  }

  private save = (): void => {
    const { types, typesError } = this.state;

    settings.set(this.state);

    if (types && !typesError) {
      store.set('types', types);
    }

    // HACK This is terribe, but since the API needs to re-connect, but since
    // the API does not yet handle re-connections properly, it is what it is
    window.location.reload();
  }
}

export default translate(App);
