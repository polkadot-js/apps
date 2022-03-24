// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParachainStakingBond } from '@polkadot/types/lookup';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN, BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onClose: () => void;
  delegatorAddress: string;
  delegation: ParachainStakingBond
  roundDuration: BN
}

function BondLessModal ({ className = '', delegation, delegatorAddress, onClose, roundDuration }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [maxTransfer, setMaxTransfer] = useState(BN_ZERO);

  useEffect((): void => {
    if (api?.consts) {
      setMaxTransfer(delegation.amount.sub(api.consts.parachainStaking.minDelegation));
    }
  }, [api, delegation]);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('schedule bond less')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns
            hint={<>
              {t<string>(`The unbonding will be scheduled for ${api.consts.parachainStaking.delegationBondLessDelay.toNumber()} rounds (${api.consts.parachainStaking.candidateBondLessDelay.mul(roundDuration).toNumber()} blocks) : `)}
              <BlockToTime value={api.consts.parachainStaking.candidateBondLessDelay.mul(roundDuration)} />
            </>}
          >
            <InputAddress
              defaultValue={delegatorAddress}
              help={t<string>('The account that has an active delegation on the collator candidate.')}
              isDisabled
              label={t<string>('delegator account')}
              type='account'
            />
          </Modal.Columns>
          <Modal.Columns
            hint={t<string>('The scheduled action needs to be manually executed after the indicated time.')}
          >
            <InputAddress
              defaultValue={delegation.owner}
              help={t<string>('Delegated collator candidate')}
              isDisabled
              label={t<string>('collator candidate')}
              type='allPlus'
            />
          </Modal.Columns>
          <Modal.Columns hint={t<string>("Decrease your delegation by this amount. You can't decrease past the minimum delegation amount.")}>
            {
              <InputBalance
                autoFocus
                isZeroable
                label={t<string>('amount')}
                labelExtra={
                  <FormatBalance
                    className={className}
                    label={t<string>('max retrivable amount')}
                    value={maxTransfer}
                  />
                }
                maxValue={maxTransfer}
                onChange={setAmount}
              />
            }
          </Modal.Columns>

        </div>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={delegatorAddress}
          icon='paper-plane'
          isDisabled={!(delegation.owner) || !amount }
          label={t<string>('schedule bond less')}
          onStart={onClose}
          params={
            [delegation.owner, amount]
          }
          tx={
            api.tx.parachainStaking.scheduleDelegatorBondLess
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(BondLessModal)`
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
