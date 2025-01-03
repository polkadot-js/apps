// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

// This is for the use of `Ledger`
//
/* eslint-disable deprecation/deprecation */

import type { ApiPromise } from '@polkadot/api';
import type { Ledger, LedgerGeneric } from '@polkadot/hw-ledger';

import React, { useCallback, useRef, useState } from 'react';

import { Button, Dropdown, Input, MarkError, Modal } from '@polkadot/react-components';
import { useApi, useLedger } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { settings } from '@polkadot/ui-settings';
import { arrayRange } from '@polkadot/util';

import Banner from '../Accounts/Banner.js';
import { useTranslation } from '../translate.js';

interface Option {
  text: string;
  value: number;
}

interface Props {
  className?: string;
  onClose: () => void;
}

export const AVAIL_INDEXES = arrayRange(20);

// query the ledger for the address, adding it to the keyring
async function queryLedger (api: ApiPromise, getLedger: () => LedgerGeneric | Ledger, name: string, accountOffset: number, addressOffset: number, ss58Prefix: number): Promise<void> {
  let address: string;
  const currApp = settings.get().ledgerApp;

  if (currApp === 'migration' || currApp === 'generic') {
    const addr = await (getLedger() as LedgerGeneric).getAddress(ss58Prefix, false, accountOffset, addressOffset);

    address = addr.address;
  } else {
    // This will always be the `chainSpecific` setting if the above condition is not met
    const addr = await (getLedger() as Ledger).getAddress(false, accountOffset, addressOffset);

    address = addr.address;
  }

  keyring.addHardware(address, 'ledger', {
    accountOffset,
    addressOffset,
    genesisHash: api.genesisHash.toHex(),
    name: name || `ledger ${accountOffset}/${addressOffset}`
  });
}

function LedgerModal ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { getLedger } = useLedger();
  const [accIndex, setAccIndex] = useState(0);
  const [addIndex, setAddIndex] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [isBusy, setIsBusy] = useState(false);

  const accOps = useRef(AVAIL_INDEXES.map((value): Option => ({
    text: t('Account type {{index}}', { replace: { index: value } }),
    value
  })));

  const addOps = useRef(AVAIL_INDEXES.map((value): Option => ({
    text: t('Address index {{index}}', { replace: { index: value } }),
    value
  })));

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: !!name.trim(), name }),
    []
  );

  const _onSave = useCallback(
    (): void => {
      setError(null);
      setIsBusy(true);

      queryLedger(api, getLedger, name, accIndex, addIndex, api.consts.system.ss58Prefix.toNumber())
        .then(() => onClose())
        .catch((error: Error): void => {
          console.error(error);

          setIsBusy(false);
          setError(error);
        });
    },
    [accIndex, addIndex, api, getLedger, name, onClose]
  );

  return (
    <Modal
      className={className}
      header={t('Add account via Ledger')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('The name for this account as it will appear under your accounts.')}>
          <Input
            autoFocus
            className='full'
            isError={!isNameValid}
            label={t('name')}
            onChange={_onChangeName}
            placeholder={t('account name')}
            value={name}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The account type that you wish to create. This is the top-level derivation.')}>
          <Dropdown
            label={t('account type')}
            onChange={setAccIndex}
            options={accOps.current}
            value={accIndex}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The address index on the account that you wish to add. This is the second-level derivation.')}>
          <Dropdown
            label={t('address index')}
            onChange={setAddIndex}
            options={addOps.current}
            value={addIndex}
          />
          {error && (
            <MarkError content={error.message} />
          )}
        </Modal.Columns>
      </Modal.Content>
      <Banner type={'warning'}>
        <p>{`You are using the Ledger ${settings.ledgerApp.toUpperCase()} App. If you would like to switch it, please go the "manage ledger app" in the settings.`}</p>
      </Banner>
      <Modal.Actions>
        <Button
          icon='plus'
          isBusy={isBusy}
          isDisabled={!isNameValid}
          label={t('Save')}
          onClick={_onSave}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(LedgerModal);
