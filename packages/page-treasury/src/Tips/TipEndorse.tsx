// Copyright 2017-2022 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, MarkWarning, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  defaultId: string | null;
  hash: string;
  isMember: boolean;
  isTipped: boolean;
  median: BN;
  members: string[];
  recipient: string;
}

const transformBalance = {
  transform: ({ freeBalance, reservedBalance }: DeriveBalancesAll): BN =>
    freeBalance.add(reservedBalance)
};

function TipEndorse ({ defaultId, hash, isMember, isTipped, median, members, recipient }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(defaultId);
  const [value, setValue] = useState<BN | undefined>();
  const totalBalance = useCall<BN>(api.derive.balances?.all, [recipient], transformBalance);

  const tipTx = (api.tx.tips || api.tx.treasury).tip;

  return (
    <>
      <Button
        icon='check'
        isDisabled={!isMember}
        label={t<string>('Tip')}
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
          header={t<string>('Submit tip endorsement')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('Your endorsement will be applied for this account.')}>
              <InputAddress
                filter={members}
                help={t<string>('Select the account you wish to submit the tip from.')}
                label={t<string>('submit with account')}
                onChange={setAccountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('Allocate a suggested tip amount. With enough endorsements, the suggested values are averaged and sent to the beneficiary.')}>
              <InputBalance
                autoFocus
                defaultValue={median}
                help={t<string>('The tip amount that should be allocated')}
                isZeroable
                label={t<string>('value')}
                onChange={setValue}
              />
              {totalBalance && totalBalance.isZero() && (
                <MarkWarning content={t<string>('The recipient account has no balance, ensure the tip is more than the existential deposit to create the account.')} />
              )}
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId}
              label={t<string>('Submit tip')}
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
