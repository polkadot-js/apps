// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  accountId: string;
  uniqueId: BN;
}

function Transfer ({ accountId, uniqueId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [amount, setAmount] = useState<BN | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);

  return (
    <>
      <Button
        icon='paper-plane'
        label={t<string>('send')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={uniqueId}
          header={t<string>('transfer unique')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The account to transfer from. This is the account that owns the unique(s)')}>
              <InputAddress
                defaultValue={accountId}
                isDisabled
                label={t<string>('send from')}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The beneficiary will have access to the transferred unique when the transaction is included in a block.')}>
              <InputAddress
                label={t<string>('send to address')}
                onChange={setRecipientId}
                type='allPlus'
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The amount of instances to transfer to the account.')}>
              <InputBalance
                autoFocus
                label={t<string>('instances to transfer')}
                onChange={setAmount}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='paper-plane'
              isDisabled={!recipientId || !amount}
              label={t<string>('Send')}
              onStart={toggleOpen}
              params={[uniqueId, recipientId, amount]}
              tx={
                api.tx.uniques.transfer}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Transfer);
