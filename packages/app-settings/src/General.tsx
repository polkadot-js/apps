// Copyright 2017-2019 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { Option } from './types';

import React, { useEffect, useState } from 'react';
import { isLedgerCapable } from '@polkadot/react-api';
import { Button, Dropdown } from '@polkadot/react-components';
import uiSettings, { SettingsStruct } from '@polkadot/ui-settings';

import translate from './translate';
import { createIdenticon, createOption, save, saveAndReload } from './util';
import SelectUrl from './SelectUrl';

interface Props extends I18nProps{
  isModalContent?: boolean;
  onClose?: () => void;
}

const prefixOptions = uiSettings.availablePrefixes.map((o): Option => createOption(o, ['default']));
const iconOptions = uiSettings.availableIcons.map((o): Option => createIdenticon(o, ['default']));
const ledgerConnOptions = uiSettings.availableLedgerConn;

function General ({ className, isModalContent, onClose, t }: Props): React.ReactElement<Props> {
  // tri-state: null = nothing  changed, false = no reload, true = reload required
  const [changed, setChanged] = useState<boolean | null>(null);
  const [settings, setSettings] = useState(uiSettings.get());

  useEffect((): void => {
    const prev = uiSettings.get();
    const hasChanges = Object.entries(settings).some(([key, value]): boolean => (prev as any)[key] !== value);
    const needsReload = prev.apiUrl !== settings.apiUrl || prev.prefix !== settings.prefix;

    setChanged(
      hasChanges
        ? needsReload
        : null
    );
  }, [settings]);

  const _handleChange = (key: keyof SettingsStruct) => <T extends string | number>(value: T): void => {
    setSettings({ ...settings, [key]: value });
  };
  const _saveAndReload = (): void => saveAndReload(settings);
  const _save = (): void => {
    save(settings);
    setChanged(null);
  };

  const { icon, i18nLang, ledgerConn, prefix, uiMode } = settings;

  return (
    <div className={className}>
      <SelectUrl onChange={_handleChange('apiUrl')} />
      {!isModalContent && (
        <>
          <div className='ui--row'>
            <Dropdown
              defaultValue={prefix}
              help={t('Override the default ss58 prefix for address generation')}
              label={t('address prefix')}
              onChange={_handleChange('prefix')}
              options={prefixOptions}
            />
          </div>
          <div className='ui--row'>
            <Dropdown
              defaultValue={icon}
              help={t('Override the default identity icon display with a specific theme')}
              label={t('default icon theme')}
              onChange={_handleChange('icon')}
              options={iconOptions}
            />
          </div>
          <div className='ui--row'>
            <Dropdown
              defaultValue={uiMode}
              help={t('Adjust the mode from basic (with a limited number of beginner-user-friendly apps) to full (with all basic & advanced apps available)')}
              label={t('interface operation mode')}
              onChange={_handleChange('uiMode')}
              options={uiSettings.availableUIModes}
            />
          </div>
          {isLedgerCapable() && (
            <div className='ui--row'>
              <Dropdown
                defaultValue={ledgerConn}
                help={t('Manage your connection to Ledger S')}
                label={t('manage hardware connections')}
                onChange={_handleChange('ledgerConn')}
                options={ledgerConnOptions}
              />
            </div>
          )}
          <div className='ui--row'>
            <Dropdown
              defaultValue={i18nLang}
              label={t('default interface language')}
              onChange={_handleChange('i18nLang')}
              options={uiSettings.availableLanguages}
            />
          </div>
        </>
      )}
      <Button.Group>
        {isModalContent && (
          <>
            <Button
              isNegative
              label={t('Cancel')}
              icon='cancel'
              onClick={onClose}
            />
            <Button.Or />
          </>
        )}
        <Button
          isDisabled={changed === null}
          isPrimary
          onClick={
            changed
              ? _saveAndReload
              : _save
          }
          label={
            changed
              ? t('Save & Reload')
              : t('Save')
          }
          icon='save'
        />
      </Button.Group>
    </div>
  );
}

export default translate(General);
