// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

interface Props {
  accountId: string;
  assetId: BN;
  className?: string;
  minBalance: BN;
  siFormat: [number, string];
}

function Transfer ({ accountId, assetId, className, minBalance, siFormat: [siDecimals, siSymbol] }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [amount, setAmount] = useState<BN | undefined>();
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [isProtected, setIsProtected] = useState(true);

  return (
    <>
      <Button
        icon='paper-plane'
        label={t('send')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t('transfer asset')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The account to transfer from. This account should have sufficient assets for this transfer.')}>
              <InputAddress
                defaultValue={accountId}
                isDisabled
                label={t('send from')}
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The beneficiary will have access to the transferred asset when the transaction is included in a block.')}>
              <InputAddress
                label={t('send to address')}
                onChange={setRecipientId}
                type='allPlus'
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The amount of tokens to transfer to the account.')}>
              <InputBalance
                autoFocus
                label={t('amount to transfer')}
                onChange={setAmount}
                siDecimals={siDecimals}
                siSymbol={siSymbol}
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The minimum balance allowed for the asset.')}>
              <InputBalance
                defaultValue={minBalance}
                isDisabled
                label={t('minimum balance')}
                siDecimals={siDecimals}
                siSymbol={siSymbol}
              />
            </Modal.Columns>
            <Modal.Columns hint={t('With the keep-alive option set, the account is protected against removal due to low balances.')}>
              <Toggle
                className='typeToggle'
                label={
                  isProtected
                    ? t('Transfer with account keep-alive checks')
                    : t('Normal transfer without keep-alive checks')
                }
                onChange={setIsProtected}
                value={isProtected}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='paper-plane'
              isDisabled={!recipientId || !amount}
              label={t('Send')}
              onStart={toggleOpen}
              params={[assetId, recipientId, amount]}
              tx={
                isProtected
                  ? api.tx.assets.transferKeepAlive
                  : api.tx.assets.transfer}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Transfer);
