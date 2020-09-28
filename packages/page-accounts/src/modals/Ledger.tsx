// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useRef, useState } from 'react';
import keyring from '@polkadot/ui-keyring';
import { getLedger } from '@polkadot/react-api';
import { Button, Dropdown, Modal } from '@polkadot/react-components';

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
async function queryLedger (accountOffset: number, addressOffset: number): Promise<void> {
  try {
    const ledger = getLedger();
    const { address } = await ledger.getAddress(false, accountOffset, addressOffset);

    keyring.addHardware(address, 'ledger', { accountOffset, addressOffset, name: `ledger ${accountOffset}/${addressOffset}` });
  } catch (error) {
    console.error(error);

    throw error;
  }
}

function Ledger ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
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

      queryLedger(accIndex, addIndex)
        .then(() => onClose())
        .catch((error): void => {
          setIsBusy(false);
          setError(error);
        });
    },
    [accIndex, addIndex, onClose]
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
              <article className='error'>{error.message}</article>
            )}
          </Modal.Column>
          <Modal.Column>
            <p>{t('The address index on the account that you wish to add. This is the second-level derivation.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='sync'
          isBusy={isBusy}
          label={t<string>('Save')}
          onClick={_onSave}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Ledger);
