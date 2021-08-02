// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { CreateResult, KeyringAddress } from '@polkadot/ui-keyring/types';
import type { SortedAccount } from './types';

import FileSaver from 'file-saver';
import React, { useCallback } from 'react';

import { getEnvironment } from '@polkadot/react-api/util';
import { Input, InputAddress, Menu, Modal } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/react-components/translate';
import { keyring } from '@polkadot/ui-keyring';

import PasswordInput from './modals/PasswordInput';

export function createMenuGroup (key: string, items: (React.ReactNode | false | undefined | null)[]): React.ReactNode | null {
  const filtered = items.filter((item): item is React.ReactNode => !!item);

  return filtered.length
    ? <React.Fragment key={key}><Menu.Divider />{filtered}</React.Fragment>
    : null;
}

export function downloadAccount ({ json, pair }: CreateResult): void {
  const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

  FileSaver.saveAs(blob, `${pair.address}.json`);
}

export function tryCreateAccount (getResult: () => CreateResult, success: string): ActionStatus {
  const status: ActionStatus = {
    action: 'create',
    message: success,
    status: 'success'
  };

  try {
    const result = getResult();
    const address = result.pair.address;

    status.account = address;

    if (getEnvironment() === 'web') {
      downloadAccount(result);
    }

    downloadAccount(result);
    InputAddress.setLastValue('account', address);
  } catch (error) {
    status.status = 'error';
    status.message = (error as Error).message;
  }

  return status;
}

interface AccountPass {
  password: string;
  isPassValid: boolean;
}

interface AccountName {
  name: string;
  isNameValid: boolean;
}

interface CreateAccountInputsProps {
  name: AccountName;
  setName: (value: AccountName) => void;
  setPassword: (value: AccountPass) => void;
  _onCommit: () => void;
}

export function CreateAccountInputs ({ _onCommit, name: { isNameValid, name }, setName, setPassword }: CreateAccountInputsProps): React.ReactNode {
  const { t } = useTranslation();

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: !!name.trim(), name }),
    [setName]
  );

  const _onChangePass = useCallback(
    (password: string, isValid: boolean) => setPassword({ isPassValid: isValid, password }),
    [setPassword]
  );

  return (<>
    <Modal.Columns hint={t<string>('The name for this account and how it will appear under your addresses. With an on-chain identity, it can be made available to others.')}>
      <Input
        className='full'
        help={t<string>('Name given to this account. You can edit it. To use the account to validate or nominate, it is a good practice to append the function of the account in the name, e.g "name_you_want - stash".')}
        isError={!isNameValid}
        label={t<string>('name')}
        onChange={_onChangeName}
        onEnter={_onCommit}
        placeholder={t<string>('new account')}
        value={name}
      />
    </Modal.Columns>
    <PasswordInput
      onChange={_onChangePass}
      onEnter={_onCommit}
    />
  </>);
}

function expandList (mapped: SortedAccount[], entry: SortedAccount): SortedAccount[] {
  mapped.push(entry);

  entry.children.forEach((entry): void => {
    expandList(mapped, entry);
  });

  return mapped;
}

export function sortAccounts (addresses: string[], favorites: string[]): SortedAccount[] {
  const mapped = addresses
    .map((address) => keyring.getAccount(address))
    .filter((account): account is KeyringAddress => !!account)
    .map((account): SortedAccount => ({
      account,
      children: [],
      isFavorite: favorites.includes(account.address)
    }))
    .sort((a, b) => (a.account.meta.whenCreated || 0) - (b.account.meta.whenCreated || 0));

  return mapped
    .filter((entry): boolean => {
      const parentAddress = entry.account.meta.parentAddress;

      if (parentAddress) {
        const parent = mapped.find(({ account: { address } }) => address === parentAddress);

        if (parent) {
          parent.children.push(entry);

          return false;
        }
      }

      return true;
    })
    .reduce(expandList, [])
    .sort((a, b): number =>
      a.isFavorite === b.isFavorite
        ? 0
        : b.isFavorite
          ? 1
          : -1
    );
}
