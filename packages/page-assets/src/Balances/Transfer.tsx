// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AssetId } from '@polkadot/types/interfaces';

import React, { useMemo, useState } from 'react';

import { Button, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  accountId: string;
  assetId: AssetId;
  className?: string;
  siFormat: [number, string];
}

function Transfer ({ accountId, assetId, className, siFormat: [siDecimals, siSymbol] }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [amount, setAmount] = useState<BN | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [isProtected, setIsProtected] = useState(true);

  const isAmountValid = useMemo(
    () => !!amount && !amount.isZero(),
    [amount]
  );

  return (
    <>
      <Button
        icon='paper-plane'
        label={t<string>('send')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('transfer asset')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The account to transfer from. This account should have sufficient assets for this transfer.')}>
              <InputAddress
                defaultValue={accountId}
                isDisabled
                label={t<string>('send from')}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The beneficiary will have access to the transferred asset when the transaction is included in a block.')}>
              <InputAddress
                label={t<string>('send to address')}
                onChange={setRecipientId}
                type='allPlus'
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The amount of tokens to issue to the account.')}>
              <InputBalance
                autoFocus
                isError={!isAmountValid}
                isZeroable={false}
                label={t<string>('amount to transfer')}
                onChange={setAmount}
                siDecimals={siDecimals}
                siSymbol={siSymbol}
              />
            </Modal.Columns>
            <Modal.Columns hint={t('With the keep-alive option set, the account is protected against removal due to low balances.')}>
              <Toggle
                className='typeToggle'
                label={
                  isProtected
                    ? t<string>('Transfer with account keep-alive checks')
                    : t<string>('Normal transfer without keep-alive checks')
                }
                onChange={setIsProtected}
                value={isProtected}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='paper-plane'
              isDisabled={!recipientId || !isAmountValid}
              label={t<string>('Send')}
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
