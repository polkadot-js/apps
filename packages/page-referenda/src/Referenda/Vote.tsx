// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'react-i18next';
import type { ApiPromise } from '@polkadot/api';
import type { Preimage } from '@polkadot/app-preimages/types';
import type { BN } from '@polkadot/util';
import type { PalletVote, TrackInfo } from '../types';

import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button, Modal, ProposedAction, ToggleGroup, TxButton, VoteAccount } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import VoteAbstain from './VoteAbstain';
import VoteSplit from './VoteSplit';
import VoteStandard from './VoteStandard';

interface Props {
  className?: string;
  id: BN;
  isConvictionVote: boolean;
  isMember: boolean;
  members?: string[];
  palletVote: PalletVote;
  preimage?: Preimage;
  ranks?: BN[];
  trackInfo?: TrackInfo;
}

function filterMembers (allAccounts: string[], members?: string[], ranks?: BN[], trackInfo?: TrackInfo): string[] | undefined {
  if (members) {
    const accounts = members.filter((a) => allAccounts.includes(a));

    if (ranks && trackInfo && trackInfo.compare) {
      const cmp = trackInfo.compare;

      return accounts.filter((_, i) => cmp(ranks[i]));
    }

    return accounts;
  }

  return members;
}

function createVoteOpts (api: ApiPromise, t: TFunction): { text: string, value: string }[] {
  let hasAbstain = false;

  try {
    hasAbstain = !!api.createType('PalletConvictionVotingVoteAccountVote', { SplitAbstain: { abstain: 1 } }).isSplitAbstain;
  } catch {
    hasAbstain = false;
  }

  return hasAbstain
    ? [
      { text: t<string>('Aye'), value: 'aye' },
      { text: t<string>('Nay'), value: 'nay' },
      { text: t<string>('Split'), value: 'split' },
      { text: t<string>('Abstain'), value: 'abstain' }
    ]
    : [
      { text: t<string>('Aye'), value: 'aye' },
      { text: t<string>('Nay'), value: 'nay' },
      { text: t<string>('Split'), value: 'split' }
    ];
}

function Voting ({ className, id, isConvictionVote, isMember, members, palletVote, preimage, ranks, trackInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVotingOpen, toggleVoting] = useToggle();
  const [voteTypeIndex, setVoteTypeIndex] = useState(0);
  const [params, setParams] = useState<unknown[] | undefined>();

  // Create the options for the vote toggle using the type of vote and also inspecting
  // the actual support of the on-chain runtime (e.g. Abstentions)
  const voteTypeOpts = useMemo(
    () => createVoteOpts(api, t),
    [api, t]
  );

  const filteredMembers = useMemo(
    () => filterMembers(allAccounts, members, ranks, trackInfo),
    [allAccounts, members, ranks, trackInfo]
  );

  const isDisabled = useMemo(
    () => !isMember || (
      members && filteredMembers
        ? !filteredMembers.length
        : false
    ),
    [filteredMembers, isMember, members]
  );

  if (!hasAccounts) {
    return null;
  }

  return (
    <>
      {isVotingOpen && (
        <Modal
          className={className}
          header={t<string>('Vote on referendum')}
          onClose={toggleVoting}
          size='large'
        >
          <Modal.Content>
            {preimage && (
              <Modal.Columns hint={t<string>('If this proposal is passed, the changes will be applied via dispatch and the deposit returned.')}>
                <ProposedAction
                  idNumber={id}
                  proposal={preimage.proposal}
                />
              </Modal.Columns>
            )}
            <Modal.Columns hint={t<string>('The vote will be recorded for this account. If another account delegated to this one, the delegated votes will also be counted.')}>
              <VoteAccount
                filter={filteredMembers}
                onChange={setAccountId}
              />
            </Modal.Columns>
            {isConvictionVote && (
              <>
                <Modal.Columns
                  className='centerVoteType'
                  hint={t<string>('The type of vote that you wish to cast on the referendum.')}
                >
                  <ToggleGroup
                    onChange={setVoteTypeIndex}
                    options={voteTypeOpts}
                    value={voteTypeIndex}
                  />
                </Modal.Columns>
                {voteTypeIndex === 0
                  ? (
                    <VoteStandard
                      accountId={accountId}
                      id={id}
                      isAye
                      onChange={setParams}
                      voteLockingPeriod={api.consts[palletVote as 'convictionVoting'].voteLockingPeriod}
                    />
                  )
                  : voteTypeIndex === 1
                    ? (
                      <VoteStandard
                        accountId={accountId}
                        id={id}
                        onChange={setParams}
                        voteLockingPeriod={api.consts[palletVote as 'convictionVoting'].voteLockingPeriod}
                      />
                    )
                    : voteTypeIndex === 2
                      ? (
                        <VoteSplit
                          accountId={accountId}
                          id={id}
                          onChange={setParams}
                        />
                      )
                      : (
                        <VoteAbstain
                          accountId={accountId}
                          id={id}
                          onChange={setParams}
                        />
                      )
                }
              </>
            )}
          </Modal.Content>
          <Modal.Actions>
            {isConvictionVote
              ? (
                <TxButton
                  accountId={accountId}
                  icon='check-to-slot'
                  label={t<string>('Vote')}
                  onStart={toggleVoting}
                  params={params}
                  tx={api.tx[palletVote].vote}
                />
              )
              : (
                <>
                  <TxButton
                    accountId={accountId}
                    icon='ban'
                    label={t<string>('Vote Nay')}
                    onStart={toggleVoting}
                    params={[id, false]}
                    tx={api.tx[palletVote].vote}
                  />
                  <TxButton
                    accountId={accountId}
                    icon='check'
                    label={t<string>('Vote Aye')}
                    onStart={toggleVoting}
                    params={[id, true]}
                    tx={api.tx[palletVote].vote}
                  />
                </>
              )
            }
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check-to-slot'
        isDisabled={isDisabled}
        label={t<string>('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default React.memo(styled(Voting)`
  .ui--Modal-Columns.centerVoteType > div:first-child {
    text-align: center;
  }
`);
