// Copyright 2017-2025 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/apps-config/settings/types';
import type { SettingsStruct } from '@polkadot/ui-settings/types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { createLanguages, createSs58 } from '@polkadot/apps-config';
import { allNetworks } from '@polkadot/networks';
import { Button, Dropdown, MarkWarning } from '@polkadot/react-components';
import { useApi, useIpfs, useLedger } from '@polkadot/react-hooks';
import { settings } from '@polkadot/ui-settings';

import { useTranslation } from './translate.js';
import { createIdenticon, createOption, save, saveAndReload } from './util.js';

interface Props {
  className?: string;
}

const _ledgerConnOptions = settings.availableLedgerConn;
const _ledgerAppOptions = settings.availableLedgerApp;

function General ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { chainSS58, isApiReady, isElectron } = useApi();
  const { isIpfs } = useIpfs();
  const { hasLedgerChain, hasWebUsb } = useLedger();
  // tri-state: null = nothing changed, false = no reload, true = reload required
  const [changed, setChanged] = useState<boolean | null>(null);
  const [state, setSettings] = useState((): SettingsStruct => {
    const values = settings.get();

    return { ...values, uiTheme: values.uiTheme === 'dark' ? 'dark' : 'light' };
  });

  const ledgerConnOptions = useMemo(
    () => _ledgerConnOptions.filter(({ value }) => !isElectron || value !== 'webusb'),
    [isElectron]
  );

  const iconOptions = useMemo(
    () => settings.availableIcons
      .map((o): Option => createIdenticon(o, ['default']))
      .concat(createIdenticon({ info: 'robohash', text: 'RoboHash', value: 'robohash' })),
    []
  );

  const prefixOptions = useMemo(
    (): (Option | React.ReactNode)[] => {
      const network = allNetworks.find(({ prefix }) => prefix === chainSS58);

      return createSs58(t).map((o) =>
        createOption(o, ['default'], 'empty', (o.value === -1
          ? isApiReady
            ? network
              ? ` (${network.displayName}, ${chainSS58 || 0})`
              : ` (${chainSS58 || 0})`
            : undefined
          : ` (${o.value})`
        ))
      );
    },
    [chainSS58, isApiReady, t]
  );

  const storageOptions = useMemo(
    () => [
      { text: t('Allow local in-browser account storage'), value: 'on' },
      { text: t('Do not allow local in-browser account storage'), value: 'off' }
    ],
    [t]
  );

  const themeOptions = useMemo(
    () => [
      { text: t('Light theme'), value: 'light' },
      { text: t('Dark theme'), value: 'dark' }
    ],
    [t]
  );

  const translateLanguages = useMemo(
    () => createLanguages(t),
    [t]
  );

  useEffect((): void => {
    const prev = settings.get() as unknown as Record<string, unknown>;
    const hasChanges = Object.entries(state).some(([key, value]) => prev[key] !== value);
    const needsReload = prev.apiUrl !== state.apiUrl || prev.prefix !== state.prefix;

    setChanged(
      hasChanges
        ? needsReload
        : null
    );
  }, [state]);

  const _handleChange = useCallback(
    (key: keyof SettingsStruct) => <T extends string | number>(value: T) =>
      setSettings((state) => ({ ...state, [key]: value })),
    []
  );

  const _saveAndReload = useCallback(
    () => saveAndReload(state),
    [state]
  );

  const _save = useCallback(
    (): void => {
      save(state);
      setChanged(null);
    },
    [state]
  );

  return (
    <div className={className}>
      <h1>{t('UI options')}</h1>
      <div className='ui--row'>
        <Dropdown
          defaultValue={state.icon}
          label={t('default icon theme')}
          onChange={_handleChange('icon')}
          options={iconOptions}
        />
      </div>
      <div className='ui--row'>
        <Dropdown
          defaultValue={state.uiTheme}
          label={t('default interface theme')}
          onChange={_handleChange('uiTheme')}
          options={themeOptions}
        />
      </div>
      <div className='ui--row'>
        <Dropdown
          defaultValue={state.i18nLang}
          label={t('default interface language')}
          onChange={_handleChange('i18nLang')}
          options={translateLanguages}
        />
      </div>
      <h1>{t('account options')}</h1>
      <div className='ui--row'>
        <Dropdown
          defaultValue={state.prefix}
          label={t('address prefix')}
          onChange={_handleChange('prefix')}
          options={prefixOptions}
        />
      </div>
      {!isIpfs && !isElectron && (
        <>
          <div className='ui--row'>
            <Dropdown
              defaultValue={state.storage}
              label={t('in-browser account creation')}
              onChange={_handleChange('storage')}
              options={storageOptions}
            />
          </div>
          {state.storage === 'on' && (
            <div className='ui--row'>
              <MarkWarning content={t('It is recommended that you store all keys externally to the in-page browser local storage, either on browser extensions, signers operating via QR codes or hardware devices. This option is provided for advanced users with strong backup policies.')} />
            </div>
          )}
        </>
      )}
      {hasLedgerChain && (
        <>
          <div className='ui--row'>
            <Dropdown
              defaultValue={
                hasWebUsb
                  ? state.ledgerConn
                  : ledgerConnOptions[0].value
              }
              isDisabled={!hasWebUsb}
              label={t('manage hardware connections')}
              onChange={_handleChange('ledgerConn')}
              options={ledgerConnOptions}
            />
          </div>
          <div className='ui--row'>
            <Dropdown
              defaultValue={state.ledgerApp}
              isDisabled={!hasLedgerChain}
              label={t('manage ledger app')}
              onChange={_handleChange('ledgerApp')}
              options={_ledgerAppOptions}
            />
          </div>
          {hasWebUsb
            ? state.ledgerConn !== 'none'
              ? (
                <div className='ui--row'>
                  <MarkWarning content={t('Ledger support is still experimental and some issues may remain. Trust, but verify the addresses on your devices before transferring large amounts. There are some features that will not work, including batch calls (used extensively in staking and democracy) as well as any identity operations.')} />
                </div>
              )
              : null
            : (
              <div className='ui--row'>
                <MarkWarning content={t('Ledger hardware device support is only available on Chromium-based browsers where WebUSB and WebHID support is available in the browser.')} />
              </div>
            )
          }
        </>
      )}
      <Button.Group>
        <Button
          icon='save'
          isDisabled={changed === null}
          label={
            changed
              ? t('Save & Reload')
              : t('Save')
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
