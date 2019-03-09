// Copyright 2017-2019 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';
import { SettingsStruct } from '@polkadot/ui-settings/types';

import React from 'react';
import { Route, Switch } from 'react-router';
import store from 'store';
import { getTypeRegistry } from '@polkadot/types';
import { Button, Dropdown, Input, InputFile, Tabs } from '@polkadot/ui-app/index';
import uiSettings from '@polkadot/ui-settings';
import { u8aToString } from '@polkadot/util';

import './index.css';

import translate from './translate';

type Props = AppProps & I18nProps;

type State = {
  isCustomNode: boolean,
  isTypesValid: boolean,
  isUrlValid: boolean,
  settings: SettingsStruct,
  tabs: Array<TabItem>,
  types?: { [index: string]: any } | null,
  typesPlaceholder?: string
};

class App extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const { t } = props;
    const types = store.get('types') || {};
    const names = Object.keys(types);
    const settings = uiSettings.get();
    let isCustomNode = true;

    // check to see if user has saved a custom node by seeing if their URL is equal to any preset
    for (let i = 0; i < uiSettings.availableNodes.length; i++) {
      if (uiSettings.availableNodes[i].value === settings.apiUrl) {
        isCustomNode = false;
      }
    }

    this.state = {
      isCustomNode,
      isTypesValid: true,
      isUrlValid: this.isValidUrl(settings.apiUrl),
      tabs: [
        {
          name: 'general',
          text: t('General')
        },
        {
          name: 'developer',
          text: t('Developer')
        }
      ],
      typesPlaceholder: names.length
        ? names.join(', ')
        : undefined,
      settings
    };
  }

  render () {
    const { basePath } = this.props;
    const { tabs } = this.state;

    return (
      <main className='settings--App'>
        <header>
          <Tabs
            basePath={basePath}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/developer`} render={this.renderDeveloper} />
          <Route render={this.renderGeneral} />
        </Switch>
      </main>
    );
  }

  private renderDeveloper = () => {
    const { t } = this.props;
    const { isTypesValid, types, typesPlaceholder } = this.state;

    return (
      <>
        <div className='ui--row'>
          <div className='full'>
            <InputFile
              clearContent={!types && isTypesValid}
              isError={!isTypesValid}
              label={t('additional type definitions (JSON)')}
              onChange={this.onChangeTypes}
              placeholder={typesPlaceholder}
            />
          </div>
        </div>
        <Button.Group>
          <Button
            isDisabled={!types}
            isNegative
            onClick={this.clearTypes}
            label={t('Reset')}
          />
          <Button.Or />
          <Button
            isDisabled={!isTypesValid}
            isPrimary
            onClick={this.saveDeveloper}
            label={t('Save')}
          />
        </Button.Group>
      </>
    );
  }

  private renderGeneral = () => {
    const { t } = this.props;
    const { isCustomNode, isUrlValid, settings: { apiUrl, i18nLang, uiMode, uiTheme } } = this.state;

    return (
      <>
        <div className='ui--row'>
          <div className='full'>
            <div className='sub-label'>
              {
                isCustomNode
                  ? <><a onClick={this.toggleCustomNode}>{t('pre-set')}</a> | <b>{t('custom')}</b></>
                  : <><b>{t('pre-set')}</b> | <a onClick={this.toggleCustomNode}>{t('custom')}</a></>
              }
            </div>
            {
              isCustomNode
                ? <Input
                  defaultValue={apiUrl}
                  isError={!isUrlValid}
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
        <Button.Group>
          <Button
            isDisabled={!isUrlValid}
            isPrimary
            onClick={this.saveAndReload}
            label={t('Save & Reload')}
          />
        </Button.Group>
      </>
    );
  }

  private clearTypes = (): void => {
    this.setState({
      isTypesValid: true,
      types: null,
      typesPlaceholder: ''
    });
  }

  private onChangeApiUrl = (apiUrl: string): void => {
    this.setState(({ settings }: State) => ({
      isUrlValid: this.isValidUrl(apiUrl),
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

      getTypeRegistry().register(types);

      this.setState({
        isTypesValid: true,
        types,
        typesPlaceholder
      });
    } catch (error) {
      console.error('Registering types:', error);

      this.setState({
        isTypesValid: false,
        types: null,
        typesPlaceholder: error.message
      });
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
    this.setState(({ isCustomNode, settings }: State) => {
      // reset URL to a preset when toggled to preset
      const apiUrl = isCustomNode
        ? uiSettings.availableNodes[0].value
        : settings.apiUrl;

      return {
        isCustomNode: !isCustomNode,
        isUrlValid: true,
        settings: {
          ...settings,
          apiUrl
        }
      };
    });
  }

  private isValidUrl (apiUrl: string): boolean {
    return (
      // some random length... we probably want to parse via some lib
      (apiUrl.length >= 7) &&
      // check that it starts with a valid ws identifier
      (apiUrl.startsWith('ws://') || apiUrl.startsWith('wss://'))
    );
  }

  private saveDeveloper = (): void => {
    const { isTypesValid, types } = this.state;

    if (isTypesValid) {
      store.set('types', types);
    }
  }

  private saveAndReload = (): void => {
    const { settings } = this.state;

    uiSettings.set(settings);

    // HACK This is terribe, but since the API needs to re-connect, but since
    // the API does not yet handle re-connections properly, it is what it is
    window.location.reload();
  }
}

export default translate(App);
