// Copyright 2017-2019 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { SettingsStruct } from '@polkadot/ui-settings/types';

import React from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Input, Toggle } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import uiSettings from '@polkadot/ui-settings';

import translate from './translate';

interface Props extends AppProps, I18nProps {
  onStatusChange: (status: ActionStatus) => void;
}

interface State {
  isCustomNode: boolean;
  isUrlValid: boolean;
  settings: SettingsStruct;
}

class General extends React.PureComponent<Props, State> {
  public constructor (props: Props) {
    super(props);

    const settings = uiSettings.get();
    const isCustomNode = uiSettings.availableNodes.reduce((isCustomNode, { value }): boolean => {
      return isCustomNode && value !== settings.apiUrl;
    }, true);

    this.state = {
      isCustomNode,
      isUrlValid: this.isValidUrl(settings.apiUrl),
      settings
    };
  }

  public render (): React.ReactNode {
    const { className, t } = this.props;
    const { isUrlValid, settings: { i18nLang, prefix, uiMode, uiTheme } } = this.state;

    return (
      <div className={className}>
        {this.renderEndpoint()}
        <div className='ui--row'>
          <div className='ui--medium'>
            <Dropdown
              defaultValue={prefix}
              help={t('Override the default network prefix for address generation')}
              label={t('address network prefix')}
              onChange={this.onChangePrefix}
              options={uiSettings.availablePrefixes}
            />
          </div>
        </div>
        <div className='ui--row'>
          <div className='medium'>
            <Dropdown
              defaultValue={uiTheme}
              help={t('The logo and colors for the app along with the identity icon theme.')}
              label={t('default interface theme')}
              onChange={this.onChangeUiTheme}
              options={uiSettings.availableUIThemes}
            />
          </div>
          <div className='medium'>
            <Dropdown
              defaultValue={uiMode}
              help={t('Adjust the mode from basic (with a limited number of beginner-user-friendly apps) to full (with all basic & advanced apps available)')}
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
      </div>
    );
  }

  private renderEndpoint = (): React.ReactNode => {
    const { t } = this.props;
    const { isCustomNode, isUrlValid, settings: { apiUrl } } = this.state;

    return (
      <>
        <Toggle
          asSwitch
          className='settings--cutomToggle'
          defaultValue={isCustomNode}
          label={t('custom endpoint')}
          onChange={this.onChangeCustom}
        />
        <div className='ui--row'>
          {
            isCustomNode
              ? (
                <Input
                  defaultValue={apiUrl}
                  isError={!isUrlValid}
                  label={t('remote node/endpoint to connect to')}
                  onChange={this.onChangeApiUrl}
                />
              )
              : (
                <Dropdown
                  defaultValue={apiUrl}
                  label={t('remote node/endpoint to connect to')}
                  onChange={this.onChangeApiUrl}
                  options={uiSettings.availableNodes}
                />
              )
          }
        </div>
      </>
    );
  }

  private onChangeApiUrl = (apiUrl: string): void => {
    this.setState(({ settings }: State): Pick<State, never> => ({
      isUrlValid: this.isValidUrl(apiUrl),
      settings: {
        ...settings,
        apiUrl
      }
    }));
  }

  private onChangePrefix = (prefix: number): void => {
    this.setState(({ settings }: State): Pick<State, never> => ({
      settings: {
        ...settings,
        prefix
      }
    }));
  }

  private onChangeUiMode = (uiMode: string): void => {
    this.setState(({ settings }: State): Pick<State, never> => ({
      settings: {
        ...settings,
        uiMode
      }
    }));
  }

  private onChangeUiTheme = (uiTheme: string): void => {
    this.setState(({ settings }: State): Pick<State, never> => ({
      settings: {
        ...settings,
        uiTheme
      }
    }));
  }

  private onChangeCustom = (isCustomNode: boolean): void => {
    this.setState(({ settings }: State): Pick<State, never> => ({
      isCustomNode,
      isUrlValid: true,
      settings: {
        ...settings,
        apiUrl: isCustomNode
          ? settings.apiUrl
          : uiSettings.availableNodes[0].value
      }
    }));
  }

  private isValidUrl (apiUrl: string): boolean {
    return (
      // some random length... we probably want to parse via some lib
      (apiUrl.length >= 7) &&
      // check that it starts with a valid ws identifier
      (apiUrl.startsWith('ws://') || apiUrl.startsWith('wss://'))
    );
  }

  private saveAndReload = (): void => {
    const { settings } = this.state;

    uiSettings.set(settings);

    // HACK This is terribe, but since the API needs to re-connect, but since
    // the API does not yet handle re-connections properly, it is what it is
    window.location.reload();
  }
}

export default translate(styled(General)`
  .settings--cutomToggle {
    text-align: right;
  }

  .ui.menu {
    justify-content: flex-end;
    margin-bottom: 0;

    .active.item {
      font-weight: bold;
    }
  }

  .sub-label {
    cursor: pointer;
    padding: 0rem .5833rem;
    text-align: right;
  }
`);
