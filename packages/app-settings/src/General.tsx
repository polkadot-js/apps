// Copyright 2017-2019 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { Option } from './types';

import React, { useState } from 'react';
import { Button, Dropdown } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import uiSettings from '@polkadot/ui-settings';

import translate from './translate';
import { createOption, saveAndReload } from './util';
import SelectUrl from './SelectUrl';

interface Props extends AppProps, I18nProps {
  onStatusChange: (status: ActionStatus) => void;
}

const prefixOptions = uiSettings.availablePrefixes.map((o): Option => createOption(o, ['default']));
const themeOptions = uiSettings.availableUIThemes; // .map((o): Option => createOption(o));

function General ({ className, t }: Props): React.ReactElement<Props> {
  const [settings, setSettings] = useState(uiSettings.get());
  const { i18nLang, prefix, uiMode, uiTheme } = settings;

  const _onChangeApiUrl = (apiUrl: string): void => setSettings({ ...settings, apiUrl });
  const _onChangePrefix = (prefix: number): void => setSettings({ ...settings, prefix });
  const _onChangeUiMode = (uiMode: string): void => setSettings({ ...settings, uiMode });
  const _onChangeUiTheme = (uiTheme: string): void => setSettings({ ...settings, uiTheme });
  const _saveAndReload = (): void => saveAndReload(settings);

  return (
    <div className={className}>
      <SelectUrl onChange={_onChangeApiUrl} />
      <div className='ui--row'>
        <div className='ui--medium'>
          <Dropdown
            defaultValue={prefix}
            help={t('Override the default ss58 prefix for address generation')}
            label={t('address prefix')}
            onChange={_onChangePrefix}
            options={prefixOptions}
          />
        </div>
      </div>
      <div className='ui--row'>
        <div className='medium'>
          <Dropdown
            defaultValue={uiTheme}
            help={t('The logo and colors for the app along with the identity icon theme.')}
            label={t('default interface theme')}
            onChange={_onChangeUiTheme}
            options={themeOptions}
          />
        </div>
        <div className='medium'>
          <Dropdown
            defaultValue={uiMode}
            help={t('Adjust the mode from basic (with a limited number of beginner-user-friendly apps) to full (with all basic & advanced apps available)')}
            label={t('interface operation mode')}
            onChange={_onChangeUiMode}
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
          isPrimary
          onClick={_saveAndReload}
          label={t('Save & Reload')}
        />
      </Button.Group>
    </div>
  );
}

export default translate(General);
