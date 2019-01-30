// Copyright 2017-2019 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { SettingsStruct } from '@polkadot/ui-settings/types';

import React from 'react';
import store from 'store';
import typeRegistry from '@polkadot/types/codec/typeRegistry';
import { Button, Dropdown, Input, InputFile } from '@polkadot/ui-app/index';
import uiSettings from '@polkadot/ui-settings';
import { u8aToString } from '@polkadot/util';

import './index.css';

import translate from './translate';

type Props = AppProps & I18nProps;

type State = {
  settings: SettingsStruct & {
    types?: { [index: string]: any } | null,
    typesError?: boolean,
    typesPlaceholder?: string,
    customNode: boolean
  }
};

class App extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const types = store.get('types') || {};
    const names = Object.keys(types);
    const presets = uiSettings.get();

    // check to see if user has saved a custom node by seeing if their URL is equal to any preset
    let customNode = true;
    for (let i = 0; i < uiSettings.availableNodes.length; i++) {
      if (uiSettings.availableNodes[i].value === presets.apiUrl) {
        customNode = false;
      }
    }

    this.state = {
      settings: {
        ...presets,
        typesPlaceholder: names.length
          ? names.join(', ')
          : undefined,
        customNode: customNode
      }
    };
  }

  render () {
    const { t } = this.props;
    const { settings: { apiUrl, i18nLang, typesPlaceholder, typesError, uiMode, uiTheme, customNode } } = this.state;

    return (
      <main className='settings--App'>
        <section>
          <h1>{t('general')}</h1>
          <div className='ui--row'>
            <div className='full'>
              <div className='sub-label'>
                {
                  customNode
                    ? <><a onClick={this.toggleCustomNode}>{t('pre-set')}</a> | <b>{t('custom')}</b></>
                    : <><b>{t('pre-set')}</b> | <a onClick={this.toggleCustomNode}>{t('custom')}</a></>
                }
              </div>
              {
                customNode
                  ? <Input
                    defaultValue={apiUrl}
                    label={t('remote node/endpoint to connect to')}
                    onChange={this.onChangeApiUrl}
                  />
                  : <Dropdown
                    defaultValue={apiUrl}
                    label={t('remote node/endpoint to connect to')}
                    onChange={this.onChangeApiUrl}
                    options={uiSettings.availableNodes}
                  />
              }
            </div>
          </div>
          <div className='ui--row'>
            <div className='medium'>
              <Dropdown
                defaultValue={uiTheme}
                label={t('default interface theme')}
                onChange={this.onChangeUiTheme}
                options={uiSettings.availableUIThemes}
              />
            </div>
            <div className='medium'>
              <Dropdown
                defaultValue={uiMode}
                label={t('interface operation mode')}
                onChange={this.onChangeUiMode}
                options={uiSettings.availableUIModes}
              />
            </div>
          </div>
          <div className='ui--row'>
            <div className='full'>
              <Dropdown
                defaultValue={i18nLang}
                isDisabled
                label={t('default interface language')}
                onChange={this.onChangeLang}
                options={uiSettings.availableLanguages}
              />
            </div>
          </div>
        </section>
        <section>
          <h1>{t('developer')}</h1>
          <div className='ui--row'>
            <div className='full'>
              <InputFile
                isError={typesError}
                label={t('additional type definitions (JSON)')}
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
            label={t('Save & Reload')}
          />
        </Button.Group>
      </main>
    );
  }

  private onChangeApiUrl = (apiUrl: string): void => {
    this.setState(({ settings }: State) => ({
      settings: {
        ...settings,
        apiUrl
      }
    }));
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

      this.setState(({ settings }: State) => ({
        settings: {
          ...settings,
          types,
          typesError: false,
          typesPlaceholder
        }
      }));
    } catch (error) {
      console.error('Registering types:', error);

      this.setState(({ settings }: State) => ({
        settings: {
          ...settings,
          types: null,
          typesError: true,
          typesPlaceholder: error.message
        }
      }));
    }
  }

  private onChangeUiMode = (uiMode: string): void => {
    this.setState(({ settings }: State) => ({
      settings: {
        ...settings,
        uiMode
      }
    }));
  }

  private onChangeUiTheme = (uiTheme: string): void => {
    this.setState(({ settings }: State) => ({
      settings: {
        ...settings,
        uiTheme
      }
    }));
  }

  private toggleCustomNode = (): void => {
    this.setState(({ settings }: State) => {
      const customNode = !settings.customNode;
      // reset URL to a preset when toggled to preset
      const apiUrl = customNode
        ? settings.apiUrl
        : uiSettings.availableNodes[0].value;

      return {
        settings: {
          ...settings,
          apiUrl,
          customNode
        }
      };
    });
  }

  private save = (): void => {
    const { onStatusChange, t } = this.props;
    const { settings: { types, typesError } } = this.state;

    // validate custom node url
    const apiUrl = this.state.settings.apiUrl;

    if (this.state.settings.customNode) {
      if (!(apiUrl.startsWith('ws://localhost') ||
      apiUrl.startsWith('ws://127.0.0.1') ||
      apiUrl.startsWith('wss://'))) {
        onStatusChange({
          action: '',
          status: 'error',
          message: t('Custom node URL is not valid')
        });

        return;
      }
    }

    uiSettings.set(this.state.settings);

    if (types && !typesError) {
      store.set('types', types);
    }

    // HACK This is terribe, but since the API needs to re-connect, but since
    // the API does not yet handle re-connections properly, it is what it is
    window.location.reload();
  }
}

export default translate(App);
