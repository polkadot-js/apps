// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types-codec';

import React from 'react';

import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN, BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onClose: () => void;
  delegatorAddress: string | null;
  candidateAddress: string;
  roundDuration?: BN;
  delegationAmount: BN;
}

function RevokeModal ({ candidateAddress, className = '', delegationAmount, delegatorAddress, onClose, roundDuration }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const revokeDelegationDelay = api.consts.parachainStaking.revokeDelegationDelay as u32;
  const delayInBlocks = revokeDelegationDelay.mul(roundDuration || BN_ZERO);

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
              {t<string>(`The revoke will be scheduled for ${revokeDelegationDelay.toNumber()} rounds (${delayInBlocks.toNumber()} blocks) : `)}
              <BlockToTime value={delayInBlocks} />
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

export default React.memo(RevokeModal);
