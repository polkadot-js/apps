// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { DerivedVoterPositions } from '@polkadot/api-derive/types';
import { I18nProps, StringOrNull } from '@polkadot/react-components/types';
import { TxSource } from '@polkadot/react-hooks/types';
import { ComponentProps } from '../types';

import BN from 'bn.js';
import React, { useState } from 'react';
import styled from 'styled-components';
import { AddressMini, Button, Toggle, TxModalNew as TxModal } from '@polkadot/react-components';
import { useApi, useTxModal } from '@polkadot/react-hooks';

import translate from '../translate';
import VoteValue from './VoteValue';

type VoteType = 'member' | 'runnerup' | 'candidate';

interface Props extends ComponentProps, I18nProps {
  voterPositions?: DerivedVoterPositions;
}

const Candidates = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .candidate {
    border: 1px solid #eee;
    border-radius: 0.25rem;
    margin: 0.25rem;
    padding: 0 0.5rem 0.25rem;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      border-color: transparent;
      border-style: solid;
      border-radius: 0.25em;
      border-width: 0.25em;
    }

    &.isAye {
      background: #fff;
      border-color: #ccc;
    }

    &.member::after {
      border-color: green;
    }

    &.runnerup::after {
      border-color: steelblue;
    }

    .ui--AddressMini-icon {
      z-index: 1;
    }

    .candidate-right {
      text-align: right;
    }
  }
`;

function Vote ({ electionsInfo: { candidates, members, runnersUp }, t }: Props): React.ReactElement<Props> {
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const [voteValue, setVoteValue] = useState<BN>(new BN(0));

  const { api } = useApi();

  const _onChangeVote = (accountId: string): (_: boolean) => void =>
    (isChecked: boolean): void => {
      setVotes({
        ...votes,
        [accountId]: isChecked
      });
    };

  const _fetchVotes = (accountId: StringOrNull): void => {
    (api.query.electionPhragmen || api.query.elections)
      .votesOf<[AccountId[]] & Codec>(accountId || undefined)
      .then(([existingVotes]: [AccountId[]]): void => {
        existingVotes.forEach((accountId): void => {
          _onChangeVote(accountId.toString())(true);
        });
      });
  };

  const txModalState = useTxModal(
    (): TxSource => ({
      tx: (api.tx.electionPhragmen?.vote || api.tx.elections.vote)(
        Object.entries(votes)
          .filter(([, vote]): boolean => vote)
          .map(([accountId]): string => accountId),
        voteValue
      ),
      isSubmittable: Object.values(votes).some((vote): boolean => vote)
    }),
    [votes, voteValue],
    { onChangeAccountId: _fetchVotes }
  );

  const _candidates = candidates.map((accountId): [AccountId, VoteType] => [accountId, 'candidate']);
  const available = members
    .map(([accountId]): [AccountId, VoteType] => [accountId, 'member'])
    .concat(runnersUp.map(([accountId]): [AccountId, VoteType] => [accountId, 'runnerup']))
    .concat(_candidates);

  return (
    <TxModal
      {...txModalState}
      header={t('Vote for current candidates')}
      inputAddressLabel={t('Voting account')}
      inputAddressHelp={t('This account will be use to approve or disapprove each candidate.')}
      trigger={
        ({ onOpen }): React.ReactElement => ((
          <Button
            isDisabled={available.length === 0}
            isPrimary
            label={t('Vote')}
            icon='check'
            onClick={onOpen}
          />
        ))
      }
    >
      <VoteValue
        accountId={txModalState.accountId}
        onChange={setVoteValue}
        onEnter={txModalState.sendTx}
        onEscape={txModalState.onClose}
      />
      <Candidates>
        {available.map(([accountId, type]): React.ReactNode => {
          const key = accountId.toString();
          const isAye = votes[key] || false;

          return (
            <AddressMini
              className={`candidate ${isAye ? 'isAye' : 'isNay'} ${type}`}
              key={key}
              value={key}
            >
              <div className='candidate-right'>
                <Toggle
                  label={
                    isAye
                      ? t('Aye')
                      : t('Nay')
                  }
                  onChange={_onChangeVote(key)}
                  value={isAye}
                />
              </div>
            </AddressMini>
          );
        })}
      </Candidates>
    </TxModal>
  );
}

export default translate(Vote);
