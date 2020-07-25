// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/apps-config/settings/types';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { createLanguages, createSs58 } from '@polkadot/apps-config/settings';
import { isLedgerCapable } from '@polkadot/react-api';
import { Button, ButtonCancel, Dropdown, Modal } from '@polkadot/react-components';
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

function General ({ className = '', isModalContent, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  // tri-state: null = nothing changed, false = no reload, true = reload required
  const [changed, setChanged] = useState<boolean | null>(null);
  const [settings, setSettings] = useState(uiSettings.get());
  const iconOptions = useMemo(
    () => uiSettings.availableIcons.map((o): Option => createIdenticon(o, ['default'])),
    []
  );
  const prefixOptions = useMemo(
    () => createSs58(t).map((o): Option | React.ReactNode => createOption(o, ['default'])),
    [t]
  );
  const translateLanguages = useMemo(
    () => createLanguages(t),
    [t]
  );

  useEffect((): void => {
    const prev = uiSettings.get() as unknown as Record<string, unknown>;
    const hasChanges = Object.entries(settings).some(([key, value]) => prev[key] !== value);
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

  const { i18nLang, icon, ledgerConn, prefix, uiMode } = settings;
  const networkSelector = <SelectUrl onChange={_handleChange('apiUrl')} />;

  return (
    <div className={className}>
      {isModalContent
        ? (
          <Modal.Columns>
            <Modal.Column>{networkSelector}</Modal.Column>
            <Modal.Column>
              {t<string>('The RPC node can be selected from the pre-defined list or manually entered, depending on the chain you wish to connect to.')}
            </Modal.Column>
          </Modal.Columns>
        )
        : networkSelector
      }
      {!isModalContent && (
        <>
          <div className='ui--row'>
            <Dropdown
              defaultValue={prefix}
              help={t<string>('Override the default ss58 prefix for address generation')}
              label={t<string>('address prefix')}
              onChange={_handleChange('prefix')}
              options={prefixOptions}
            />
          </div>
          <div className='ui--row'>
            <Dropdown
              defaultValue={icon}
              help={t<string>('Override the default identity icon display with a specific theme')}
              label={t<string>('default icon theme')}
              onChange={_handleChange('icon')}
              options={iconOptions}
            />
          </div>
          <div className='ui--row'>
            <Dropdown
              defaultValue={uiMode}
              help={t<string>('Adjust the mode from basic (with a limited number of beginner-user-friendly apps) to full (with all basic & advanced apps available)')}
              label={t<string>('interface operation mode')}
              onChange={_handleChange('uiMode')}
              options={uiSettings.availableUIModes}
            />
          </div>
          {isLedgerCapable() && (
            <div className='ui--row'>
              <Dropdown
                defaultValue={ledgerConn}
                help={t<string>('Manage your connection to Ledger S')}
                label={t<string>('manage hardware connections')}
                onChange={_handleChange('ledgerConn')}
                options={ledgerConnOptions}
              />
            </div>
          )}
          <div className='ui--row'>
            <Dropdown
              defaultValue={i18nLang}
              label={t<string>('default interface language')}
              onChange={_handleChange('i18nLang')}
              options={translateLanguages}
            />
          </div>
        </>
      )}
      <Button.Group>
        {isModalContent && (
          <ButtonCancel onClick={onClose} />
        )}
        <Button
          icon='save'
          isDisabled={changed === null}
          label={
            changed
              ? t<string>('Save & Reload')
              : t<string>('Save')
          }
          onClick={
            changed
              ? _saveAndReload
              : _save
          }
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(General);
