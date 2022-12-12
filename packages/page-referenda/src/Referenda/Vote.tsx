// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Preimage } from '@polkadot/app-preimages/types';
import type { BN } from '@polkadot/util';
import type { PalletVote, TrackInfo } from '../types';

import React, { useMemo, useState } from 'react';

import { Button, ConvictionDropdown, Modal, ProposedAction, TxButton, VoteAccount, VoteValue } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
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

function Voting ({ id, isConvictionVote, isMember, members, palletVote, preimage, ranks, trackInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<BN | undefined>();
  const [conviction, setConviction] = useState(0);
  const [isVotingOpen, toggleVoting] = useToggle();

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

  const [paramsAbstain, paramsAye, paramsNay] = useMemo(
    () => [
      // only available on conviction votes
      // FIXME: We want to do vote splits as well
      isConvictionVote
        ? [id, { SplitAbstain: { abstain: balance } }]
        : null,
      isConvictionVote
        ? [id, { Standard: { balance, vote: { aye: true, conviction } } }]
        : [id, true],
      isConvictionVote
        ? [id, { Standard: { balance, vote: { aye: false, conviction } } }]
        : [id, false]
    ],
    [balance, conviction, id, isConvictionVote]
  );

  if (!hasAccounts) {
    return null;
  }

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t<string>('Vote on proposal')}
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
              <Modal.Columns
                hint={
                  <>
                    <p>{t<string>('The balance associated with the vote will be locked as per the conviction specified and will not be available for transfer during this period.')}</p>
                    <p>{t<string>('Conviction locks do overlap and are not additive, meaning that funds locked during a previous vote can be locked again.')}</p>
                  </>
                }
              >
                <VoteValue
                  accountId={accountId}
                  autoFocus
                  onChange={setBalance}
                />
                <ConvictionDropdown
                  help={t<string>('The conviction to use for this vote, with an appropriate lock period.')}
                  label={t<string>('conviction')}
                  onChange={setConviction}
                  value={conviction}
                />
              </Modal.Columns>
            )}
          </Modal.Content>
          <Modal.Actions>
            {isConvictionVote && paramsAbstain && (
              <TxButton
                accountId={accountId}
                icon='pause'
                label={t<string>('Abstain')}
                onStart={toggleVoting}
                params={paramsAbstain}
                tx={api.tx[palletVote].vote}
              />
            )}
            <TxButton
              accountId={accountId}
              icon='ban'
              label={t<string>('Vote Nay')}
              onStart={toggleVoting}
              params={paramsNay}
              tx={api.tx[palletVote].vote}
            />
            <TxButton
              accountId={accountId}
              icon='check'
              label={t<string>('Vote Aye')}
              onStart={toggleVoting}
              params={paramsAye}
              tx={api.tx[palletVote].vote}
            />
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

export default React.memo(Voting);
