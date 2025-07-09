// Copyright 2017-2025 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, MarkWarning, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

interface Props {
  defaultId: string | null;
  hash: string;
  isMember: boolean;
  isTipped: boolean;
  median: BN;
  members: string[];
  recipient: string;
}

const OPT = {
  transform: ({ freeBalance, reservedBalance }: DeriveBalancesAll): BN =>
    freeBalance.add(reservedBalance)
};

function TipEndorse ({ defaultId, hash, isMember, isTipped, median, members, recipient }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(defaultId);
  const [value, setValue] = useState<BN | undefined>();
  const totalBalance = useCall<BN>(api.derive.balances?.all, [recipient], OPT);

  const tipTx = (api.tx.tips || api.tx.treasury).tip;

  return (
    <>
      <Button
        icon='check'
        isDisabled={!isMember}
        label={t('Tip')}
        onClick={toggleOpen}
      />
      <TxButton
        accountId={defaultId}
        className='media--1600'
        icon='fighter-jet'
        isDisabled={!isMember || !isTipped}
        isIcon
        params={[hash, median]}
        tx={tipTx}
        withoutLink
      />
      {isOpen && (
        <Modal
          header={t('Submit tip endorsement')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('Your endorsement will be applied for this account.')}>
              <InputAddress
                filter={members}
                label={t('submit with account')}
                onChange={setAccountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns hint={t('Allocate a suggested tip amount. With enough endorsements, the suggested values are averaged and sent to the beneficiary.')}>
              <InputBalance
                autoFocus
                defaultValue={median}
                isZeroable
                label={t('value')}
                onChange={setValue}
              />
              {totalBalance && totalBalance.isZero() && (
                <MarkWarning content={t('The recipient account has no balance, ensure the tip is more than the existential deposit to create the account.')} />
              )}
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId}
              label={t('Submit tip')}
              onStart={toggleOpen}
              params={[hash, value]}
              tx={tipTx}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(TipEndorse);
