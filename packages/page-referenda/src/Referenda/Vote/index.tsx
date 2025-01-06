// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Preimage } from '@polkadot/react-hooks/types';
import type { BN } from '@polkadot/util';
import type { PalletVote, TrackInfo } from '../../types.js';

import React, { useMemo, useState } from 'react';

import { Button, Modal, styled, ToggleGroup, TxButton, VoteAccount } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { ProposedAction } from '@polkadot/react-params';

import { useTranslation } from '../../translate.js';
import VoteAbstain from './VoteAbstain.js';
import VoteSplit from './VoteSplit.js';
import VoteStandard from './VoteStandard.js';

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

    if (ranks && trackInfo?.compare) {
      const cmp = trackInfo.compare;

      return accounts.filter((_, i) => cmp(ranks[i]));
    }

    return accounts;
  }

  return members;
}

function createVoteOpts (api: ApiPromise, t: (key: string, options?: { replace: Record<string, unknown> }) => string): { text: string, value: string }[] {
  let hasAbstain = false;

  try {
    hasAbstain = !!api.createType('PalletConvictionVotingVoteAccountVote', { SplitAbstain: { abstain: 1 } }).isSplitAbstain;
  } catch {
    hasAbstain = false;
  }

  return hasAbstain
    ? [
      { text: t('Aye'), value: 'aye' },
      { text: t('Nay'), value: 'nay' },
      { text: t('Split'), value: 'split' },
      { text: t('Abstain'), value: 'abstain' }
    ]
    : [
      { text: t('Aye'), value: 'aye' },
      { text: t('Nay'), value: 'nay' },
      { text: t('Split'), value: 'split' }
    ];
}

function Voting ({ className, id, isConvictionVote, isMember, members, palletVote, preimage, ranks, trackInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isOpen, toggleOpen] = useToggle();
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
      {isOpen && (
        <StyledModal
          className={className}
          header={t('Vote on referendum')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            {preimage && (
              <Modal.Columns hint={t('If this proposal is passed, the changes will be applied via dispatch and the deposit returned.')}>
                <ProposedAction
                  idNumber={id}
                  proposal={preimage.proposal}
                />
              </Modal.Columns>
            )}
            <Modal.Columns hint={t('The vote will be recorded for this account. If another account delegated to this one, the delegated votes will also be counted.')}>
              <VoteAccount
                filter={filteredMembers}
                onChange={setAccountId}
              />
            </Modal.Columns>
            {isConvictionVote && (
              <>
                <Modal.Columns
                  className='centerVoteType'
                  hint={t('The type of vote that you wish to cast on the referendum.')}
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
                  label={t('Vote')}
                  onStart={toggleOpen}
                  params={params}
                  tx={api.tx[palletVote].vote}
                />
              )
              : (
                <>
                  <TxButton
                    accountId={accountId}
                    icon='ban'
                    label={t('Vote Nay')}
                    onStart={toggleOpen}
                    params={[id, false]}
                    tx={api.tx[palletVote].vote}
                  />
                  <TxButton
                    accountId={accountId}
                    icon='check'
                    label={t('Vote Aye')}
                    onStart={toggleOpen}
                    params={[id, true]}
                    tx={api.tx[palletVote].vote}
                  />
                </>
              )
            }
          </Modal.Actions>
        </StyledModal>
      )}
      <Button
        icon='check-to-slot'
        isDisabled={isDisabled}
        label={t('Vote')}
        onClick={toggleOpen}
      />
    </>
  );
}

const StyledModal = styled(Modal)`
  .ui--Modal-Columns.centerVoteType > div:first-child {
    text-align: center;
  }
`;

export default React.memo(Voting);
