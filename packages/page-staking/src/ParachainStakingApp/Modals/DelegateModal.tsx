// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  ParachainStakingCandidateMetadata,
  ParachainStakingDelegator
} from '@polkadot/types/lookup'
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { InputAddress, InputBalance, MarkError, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available, FormatBalance } from '@polkadot/react-query';
import { BN, BN_HUNDRED, BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onClose: () => void;
  delegatorAddress?: string;
  candidateAddress?: string;
  minContribution: string
}

function DelegateModal ({ className = '', delegatorAddress, candidateAddress, minContribution, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [enoughContribution, setEnoughContribution] = useState(false);
  const [maxTransfer, setMaxTransfer] = useState<BN | null>(null);
  const [candidateDelegationCount, setCandidateDelegationCount] = useState(BN_ZERO);
  const [delegationCount, setDelegationCount] = useState(0);
  const [selectedDelegator, setSelectedDelegator] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const delegator = delegatorAddress || selectedDelegator;
  const candidate = candidateAddress || selectedCandidate;

  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [delegator]);

  useEffect((): void => {
    if (
      balances &&
      balances.availableBalance &&
      delegator &&
      candidate &&
      isFunction(api.rpc.payment?.queryInfo)
    ) {
      try {
        api.tx.parachainStaking
          ?.delegate(candidate, balances.availableBalance, candidateDelegationCount, delegationCount)
          .paymentInfo(delegator)
          .then(({ partialFee }): void => {
            const adjFee = partialFee.muln(110).div(BN_HUNDRED);
            setMaxTransfer(
              BN.max(
                balances.availableBalance.sub(adjFee),
                new BN(1)
              )
            );
          })
          .catch(console.error);
      } catch (error) {
        console.error((error as Error).message);
      }
    } else {
      setMaxTransfer(null);
    }
  }, [api, balances, candidateDelegationCount, delegator, candidate, delegationCount]);

  useEffect((): void => {
    if (amount?.lt(new BN(minContribution))) {
      setEnoughContribution(false);
    } else {
      setEnoughContribution(true);
    }
  }, [amount, minContribution]);

  // candidateDelegationCount
  useEffect((): void => {
    api.query.parachainStaking.candidateInfo(candidate)
      .then(candidateInfo => {
        // Add 10 to cover for possible changes between time of query and actual submission of the extrinsic
        setCandidateDelegationCount(
          (candidateInfo as Option<ParachainStakingCandidateMetadata>).unwrap().delegationCount.add(new BN(10))
        );
      }).catch(console.error);
  }, [api, candidate]);

  // delegationCount
  useEffect((): void => {
    api.query.parachainStaking.delegatorState(delegator)
      .then((delegatorState) => {
        // Add 10 to cover for possible changes between time of query and actual submission of the extrinsic
        setDelegationCount(
          delegatorState.isEmpty
          ? 10
          : (delegatorState as Option<ParachainStakingDelegator>).unwrap().delegations.length + 10
        );
      }).catch(console.error);
  }, [api, delegator]);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Delegate')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns
            hint={t<string>('The delegated amount will be subtracted (along with fees) from the delegator account.')}
          >
            <InputAddress
              defaultValue={delegatorAddress}
              help={t<string>('The account you will send funds from.')}
              isDisabled={!!delegatorAddress}
              label={t<string>('delegate from account')}
              labelExtra={
                <Available
                  label={t<string>('transferrable')}
                  params={delegator}
                />
              }
              onChange={setSelectedDelegator}
              type='account'
            />
          </Modal.Columns>
          <Modal.Columns hint={t<string>('The collator candidate will receive the amount as a delegation.')}>
            <InputAddress
              defaultValue={candidateAddress}
              help={t<string>('Candidate Address')}
              isDisabled={!!candidateAddress}
              label={t<string>('delegate to collator candidate')}
              onChange={setSelectedCandidate}
              type='allPlus'
            />
          </Modal.Columns>
          <Modal.Columns hint={t<string>('Delegate this amount to the collator candidate')}>
            {
              <InputBalance
                autoFocus
                help={<>{t<string>('The minimum amount to delegate is ')}<FormatBalance value={minContribution} /></>}
                isError={!enoughContribution}
                isZeroable
                label={t<string>('amount')}
                labelExtra={
                  <>{t<string>('The minimum amount to delegate is ')}<FormatBalance value={minContribution} /></>
                }
                maxValue={maxTransfer}
                minValue={new BN(minContribution)}
                onChange={setAmount}
              />
            }
          </Modal.Columns>
          {amount?.lt(new BN(minContribution)) && <MarkError content={'Amount below minimum delegation'} />}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={delegator}
          icon='paper-plane'
          isDisabled={
            !enoughContribution ||
            !(candidate) ||
            !amount ||
            !maxTransfer ||
            amount.gt(maxTransfer)
          }
          label={t<string>('Delegate')}
          onStart={onClose}
          params={
            [
              candidate,
              amount,
              candidateDelegationCount,
              delegationCount
            ]
          }
          tx={
            api.tx.parachainStaking.delegate
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(DelegateModal)`
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
