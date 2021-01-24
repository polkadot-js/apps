// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Ledger } from '@polkadot/ui-keyring';

import React, { useCallback, useRef, useState } from 'react';

import { Button, Dropdown, MarkError, Modal } from '@polkadot/react-components';
import { useApi, useLedger } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import { useTranslation } from '../translate';

interface Option {
  text: string;
  value: number;
}

interface Props {
  className?: string;
  onClose: () => void;
}

const AVAIL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

// query the ledger for the address, adding it to the keyring
async function queryLedger (api: ApiPromise, getLedger: () => Ledger, accountOffset: number, addressOffset: number): Promise<void> {
  const { address } = await getLedger().getAddress(false, accountOffset, addressOffset);

  keyring.addHardware(address, 'ledger', {
    accountOffset,
    addressOffset,
    genesisHash: api.genesisHash.toHex(),
    name: `ledger ${accountOffset}/${addressOffset}`
  });
}

function LedgerModal ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { getLedger } = useLedger();
  const [accIndex, setAccIndex] = useState(0);
  const [addIndex, setAddIndex] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const accOps = useRef(AVAIL.map((value): Option => ({
    text: t('Account type {{index}}', { replace: { index: value } }),
    value
  })));

  const addOps = useRef(AVAIL.map((value): Option => ({
    text: t('Address index {{index}}', { replace: { index: value } }),
    value
  })));

  const _onSave = useCallback(
    (): void => {
      setError(null);
      setIsBusy(true);

      queryLedger(api, getLedger, accIndex, addIndex)
        .then(() => onClose())
        .catch((error): void => {
          console.error(error);

          setIsBusy(false);
          setError(error);
        });
    },
    [accIndex, addIndex, api, getLedger, onClose]
  );

  return (
    <Modal
      className={className}
      header={t<string>('Add account via Ledger')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <Dropdown
              help={t('The account type (derivation) to use')}
              label={t('account type')}
              onChange={setAccIndex}
              options={accOps.current}
              value={accIndex}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The account type that you wish to create. This is the top-level derivation.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Dropdown
              help={t('The address index (derivation on account) to use')}
              label={t('address index')}
              onChange={setAddIndex}
              options={addOps.current}
              value={addIndex}
            />
            {error && (
              <MarkError content={error.message} />
            )}
          </Modal.Column>
          <Modal.Column>
            <p>{t('The address index on the account that you wish to add. This is the second-level derivation.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='plus'
          isBusy={isBusy}
          label={t<string>('Save')}
          onClick={_onSave}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(LedgerModal);
