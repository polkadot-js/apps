// Copyright 2017-2025 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveAccountInfo } from '@polkadot/api-derive/types';
import type { ActionStatus, ActionStatusBase } from '@polkadot/react-components/Status/types';
import type { FunInputFile, SaveFile } from './types.js';

import React, { useCallback, useRef } from 'react';

import { Button, InputAddress } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';
import { hexToU8a } from '@polkadot/util';
import { ethereumEncode } from '@polkadot/util-crypto';

import { useTranslation } from '../translate.js';

interface Props {
  favorites: string[];
  onStatusChange: (status: ActionStatus) => void;
  toggleFavorite: (address: string) => void;
}

function Import ({ favorites, onStatusChange, toggleFavorite }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isEthereum } = useApi();
  const importInputRef = useRef<HTMLInputElement>(null);

  const _onImportResult = useCallback<(m: string, s?: ActionStatusBase['status']) => void>(
    (message, status = 'queued') => {
      onStatusChange?.({
        action: t('Import file'),
        message,
        status
      });
    },
  [onStatusChange, t]
  );

  const validateAccountInfo = useCallback(({ address: addressInput, name }: SaveFile) => {
    let address = '';
    let isAddressValid = true;
    let isAddressExisting = false;
    let isPublicKey = false;
    let isNameValid = !!name.trim();

    try {
      if (isEthereum) {
        const rawAddress = hexToU8a(addressInput);

        address = ethereumEncode(rawAddress);
        isPublicKey = rawAddress.length === 20;
      } else {
        const publicKey = keyring.decodeAddress(addressInput);

        address = keyring.encodeAddress(publicKey);
        isPublicKey = publicKey.length === 32;
      }

      const old = keyring.getAddress(address);

      if (old) {
        const newName = old.meta.name || name;

        isAddressExisting = true;
        isAddressValid = true;
        isNameValid = !!(newName || '').trim();
      }
    } catch {
      isAddressValid = false;
    }

    return {
      address,
      isAddressExisting,
      isAddressValid,
      isNameValid,
      isPublicKey
    };
  }, [isEthereum]);

  const _onAddAccount = useCallback(
    async (account: SaveFile): Promise<boolean> => {
      const { address, name } = account;
      const info: DeriveAccountInfo = await api.derive.accounts.info(address);
      const { isAddressExisting, isAddressValid, isNameValid } = validateAccountInfo(account);
      const isValid = (isAddressValid && isNameValid) && !!info?.accountId;

      if (!isValid || !info?.accountId || isAddressExisting) {
        return false;
      }

      try {
        const address = info.accountId.toString();

        // Save address
        keyring.saveAddress(address, { genesisHash: keyring.genesisHash, name: name.trim(), tags: [] });
        InputAddress.setLastValue('address', address);

        if (account.isFavorite && !favorites.includes(address)) {
          toggleFavorite(address);
        }

        return true;
      } catch (_) {
        return false;
      }
    },
    [api.derive.accounts, favorites, toggleFavorite, validateAccountInfo]
  );

  const onImport = useCallback(() => {
    if (!importInputRef.current) {
      return;
    }

    importInputRef.current.value = '';
    importInputRef.current.click();
  }, []);

  const _onInputImportFile = useCallback<FunInputFile>((e) => {
    try {
      _onImportResult(t('Importing'), 'queued');
      const fileReader = new FileReader();
      const files = e.target.files;

      if (!files) {
        return _onImportResult(t('no file chosen'), 'error');
      }

      // Read uploaded file
      fileReader.readAsText(files[0], 'UTF-8');

      // Check if the selected file does not have a .json extension.
      // If invalid, return error message.
      if (!(/(.json)$/i.test(e.target.value))) {
        return _onImportResult(t('file error'), 'error');
      }

      fileReader.onload = async (e) => {
        try {
          // Try parsing file data
          const _list = JSON.parse(e.target?.result as string) as SaveFile[];

          if (!Array.isArray(_list)) {
            return _onImportResult(t('file content error'), 'error');
          }

          const fitter: SaveFile[] = [];

          // Filter out items that match the required schema, ensuring only valid entries are retained.
          for (const item of _list) {
            if (item.name && item.address) {
              fitter.push(item);
            }
          }

          let importedAccounts = 0;

          // Add each valid account
          for (const account of fitter) {
            try {
              const flag = await _onAddAccount(account);

              importedAccounts += Number(flag);
            } catch { }
          }

          if (importedAccounts > 0) {
            _onImportResult(t('Success'), 'success');
          } else {
            _onImportResult(t('no account imported'), 'eventWarn');
          }
        } catch {
          _onImportResult(t('file content error'), 'error');
        }
      };
    } catch {
      _onImportResult(t('file content error'), 'error');
    }
  }, [_onAddAccount, _onImportResult, t]);

  return (
    <>
      <input
        accept='application/json'
        onChange={_onInputImportFile}
        ref={importInputRef}
        style={{ display: 'none' }}
        type={'file'}
      />
      <Button
        icon='file-import'
        label={t('Import')}
        onClick={onImport}
      />
    </>
  );
}

export default React.memo(Import);
