// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onClose: () => void;
  delegatorAddress: string;
  candidateAddress: string;
  roundDuration: BN
  delegationAmount: string
}

function RevokeModal ({ candidateAddress, className = '', delegationAmount, delegatorAddress, onClose, roundDuration }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('schedule revoke delegation')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns
            hint={<>
              {t<string>(`The revoke will be scheduled for ${api.consts.parachainStaking.delegationBondLessDelay.toNumber()} rounds (${api.consts.parachainStaking.revokeDelegationDelay.mul(roundDuration).toNumber()} blocks) : `)}
              <BlockToTime value={api.consts.parachainStaking.revokeDelegationDelay.mul(roundDuration)} />
            </>}
          >
            <InputAddress
              defaultValue={delegatorAddress}
              help={t<string>('The account that has an active delegation on the collator candidate.')}
              isDisabled
              label={t<string>('delegator account')}
              labelExtra={
                <FormatBalance
                  className={className}
                  label={t<string>('retrievable')}
                  value={delegationAmount}
                />
              }
              type='account'
            />
          </Modal.Columns>
          <Modal.Columns
            hint={t<string>('The scheduled action needs to be manually executed after the indicated time.')}
          >
            <InputAddress
              defaultValue={candidateAddress}
              help={t<string>('Delegated collator candidate')}
              isDisabled
              label={t<string>('collator candidate')}
              type='allPlus'
            />
          </Modal.Columns>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={delegatorAddress}
          icon='paper-plane'
          label={t<string>('schedule revoke')}
          onStart={onClose}
          params={
            [candidateAddress]
          }
          tx={
            api.tx.parachainStaking.scheduleRevokeDelegation
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(RevokeModal)`
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
