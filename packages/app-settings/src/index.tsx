// Copyright 2017-2018 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { I18nProps } from '@polkadot/ui-app/types';
import { SettingsStruct } from '@polkadot/ui-settings/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import settings from '@polkadot/ui-settings';

import './index.css';
import translate from './translate';

// styled components
import { Button, Dropdown, RowDiv, FullDiv, MediumDiv } from '@polkadot/ui-app/index';

type Props = I18nProps & {
  basePath: string,
  onStatusChange: (status: ActionStatus) => void
};

type State = SettingsStruct;

class App extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = settings.get();
  }

  render () {
    const { t } = this.props;
    const { apiUrl, i18nLang, uiMode, uiTheme } = this.state;

    return (
      <main className='settings--App'>
        <RowDiv>
          <FullDiv padding='0 0.25rem'>
            <Dropdown
              defaultValue={apiUrl}
              label={t('select.api.url', {
                defaultValue: 'remote node/endpoint to connect to'
              })}
              onChange={this.onChangeApiUrl}
              options={settings.availableNodes}
            />
          </FullDiv>
        </RowDiv>
        <RowDiv>
          <MediumDiv padding='0 0.25rem'>
            <Dropdown
              defaultValue={uiTheme}
              label={t('select.ui.theme', {
                defaultValue: 'default interface theme'
              })}
              onChange={this.onChangeUiTheme}
              options={settings.availableUIThemes}
            />
          </MediumDiv>
          <MediumDiv padding='0 0.25rem'>
            <Dropdown
              defaultValue={uiMode}
              label={t('select.ui.mode', {
                defaultValue: 'interface operation mode'
              })}
              onChange={this.onChangeUiMode}
              options={settings.availableUIModes}
            />
          </MediumDiv>
        </RowDiv>
        <RowDiv>
          <FullDiv padding='0 0.25rem'>
            <Dropdown
              defaultValue={i18nLang}
              isDisabled
              label={t('select.i18n.lang', {
                defaultValue: 'default interface language'
              })}
              onChange={this.onChangeLang}
              options={settings.availableLanguages}
            />
          </FullDiv>
        </RowDiv>
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

  private onChangeUiMode = (uiMode: string): void => {
    this.setState({ uiMode });
  }

  private onChangeUiTheme = (uiTheme: string): void => {
    this.setState({ uiTheme });
  }

  private save = (): void => {
    settings.set(this.state);

    // HACK This is terribe, but since the API needs to re-connect, but since
    // the API does not yet handle re-connections properly, it is what it is
    window.location.reload();
  }
}

export default translate(App);
