// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import styled from 'styled-components';

import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onClose: () => void;
  senderId?: string;
  collatorAddress?: Uint8Array;
  roundDuration: BN
  delegationAmount: string
}

function UndelegateModal ({ className = '', collatorAddress, delegationAmount, onClose, roundDuration, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [senderId, setSenderId] = useState<string | null>(null);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Revoke Delegation')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns
            hint={<>{t<string>(`The delegating account will get their tokens back after ${Number(api.consts.parachainStaking.leaveDelegatorsDelay)} rounds (${Number(api.consts.parachainStaking.leaveDelegatorsDelay) * Number(roundDuration)} blocks): `)}<BlockToTime value={new BN(Number(api.consts.parachainStaking.candidateBondLessDelay) * Number(roundDuration))} /></>}
          >
            <InputAddress
              defaultValue={propSenderId}
              help={t<string>('The account you will send funds from.')}
              isDisabled={!!propSenderId}
              label={t<string>('delegate from account')}
              labelExtra={
                <FormatBalance
                  className={className}
                  label={t<string>('retrievable')}
                  value={delegationAmount}
                />
              }
              onChange={setSenderId}
              type='allPlus'
            />
          </Modal.Columns>
          <Modal.Columns hint={t<string>('This is the address of the collator that will lose the delegation.')}>
            <InputAddress
              defaultValue={collatorAddress}
              help={t<string>('Select a contact or paste the address you want to send funds to.')}
              isDisabled={!!collatorAddress}
              label={t<string>('delegate to collator address')}
              type='account'
            />
          </Modal.Columns>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={propSenderId || senderId}
          icon='paper-plane'
          label={t<string>('Revoke Delegation')}
          onStart={onClose}
          params={
            [collatorAddress]
          }
          tx={
            api.tx.parachainStaking.scheduleRevokeDelegation
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(UndelegateModal)`
  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }

  .typeToggle {
    text-align: right;
  }

  .typeToggle+.typeToggle {
    margin-top: 0.375rem;
  }
`);
