// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/apps-config/settings/types';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { availableLanguages, availableSs58 } from '@polkadot/apps-config/settings';
import { isLedgerCapable } from '@polkadot/react-api';
import { Button, ButtonCancel, Dropdown } from '@polkadot/react-components';
import uiSettings, { SettingsStruct } from '@polkadot/ui-settings';

import { useTranslation } from './translate';
import { createIdenticon, createOption, save, saveAndReload } from './util';
import SelectUrl from './SelectUrl';

interface Props {
  className?: string;
  isModalContent?: boolean;
  onClose: () => void;
}

const ledgerConnOptions = uiSettings.availableLedgerConn;

function General ({ className, isModalContent, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  // tri-state: null = nothing changed, false = no reload, true = reload required
  const [changed, setChanged] = useState<boolean | null>(null);
  const [settings, setSettings] = useState(uiSettings.get());
  const iconOptions = useMemo((): Option[] => {
    return uiSettings.availableIcons.map((o): Option => createIdenticon(t, o, ['default']));
  }, [t]);
  const prefixOptions = useMemo((): (Option | React.ReactNode)[] => {
    return availableSs58.map((o): Option | React.ReactNode => createOption(t, o, ['default']));
  }, [t]);
  const translateLanguages = useMemo((): Option[] => {
    return availableLanguages.map(({ text, value, withI18n }) => ({
      value,
      text: withI18n ? t(text as string) : text
    }));
  }, [t]);

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

  const _handleChange = useCallback(
    (key: keyof SettingsStruct) => <T extends string | number>(value: T): void =>
      setSettings((settings) => ({ ...settings, [key]: value })),
    []
  );
  const _saveAndReload = useCallback(
    (): void => saveAndReload(settings),
    [settings]
  );
  const _save = useCallback(
    (): void => {
      save(settings);
      setChanged(null);
    },
    [settings]
  );

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
              options={translateLanguages}
            />
          </div>
        </>
      )}
      <Button.Group>
        {isModalContent && (
          <>
            <ButtonCancel onClick={onClose} />
            <Button.Or />
          </>
        )}
        <Button
          isDisabled={changed === null}
          isPrimary={isModalContent}
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

export default React.memo(General);
