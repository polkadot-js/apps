// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PropIndex, Proposal } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useMemo, useState } from 'react';

import { Button, ConvictionDropdown, Modal, TxButton, VoteAccount, VoteValue } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { ProposedAction } from '@polkadot/react-params';

import { useTranslation } from '../translate.js';

interface Props {
  proposal?: Proposal;
  referendumId: PropIndex;
}

function Voting ({ proposal, referendumId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<BN | undefined>();
  const [conviction, setConviction] = useState(1);
  const [isVotingOpen, toggleVoting] = useToggle();

  const isCurrentVote = useMemo(
    () => !!api.query.democracy.votingOf,
    [api]
  );

  if (!hasAccounts) {
    return null;
  }

  const isDisabled = isCurrentVote ? !balance : false;

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t('Vote on proposal')}
          onClose={toggleVoting}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('If this proposal is passed, the changes will be applied via dispatch and the deposit returned.')}>
              <ProposedAction
                idNumber={referendumId}
                proposal={proposal}
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The vote will be recorded for this account. If another account delegated to this one, the delegated votes will also be counted.')}>
              <VoteAccount onChange={setAccountId} />
            </Modal.Columns>
            <Modal.Columns
              hint={
                <>
                  <p>{t('The balance associated with the vote will be locked as per the conviction specified and will not be available for transfer during this period.')}</p>
                  <p>{t('Conviction locks do overlap and are not additive, meaning that funds locked during a previous vote can be locked again.')}</p>
                </>
              }
            >
              {isCurrentVote && (
                <VoteValue
                  accountId={accountId}
                  autoFocus
                  onChange={setBalance}
                />
              )}
              <ConvictionDropdown
                label={t('conviction')}
                onChange={setConviction}
                value={conviction}
                voteLockingPeriod={
                  api.consts.democracy.voteLockingPeriod ||
                  api.consts.democracy.enactmentPeriod
                }
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='ban'
              isDisabled={isDisabled}
              label={t('Vote Nay')}
              onStart={toggleVoting}
              params={
                isCurrentVote
                  ? [referendumId, { Standard: { balance, vote: { aye: false, conviction } } }]
                  : [referendumId, { aye: false, conviction }]
              }
              tx={api.tx.democracy.vote}
            />
            <TxButton
              accountId={accountId}
              icon='check'
              isDisabled={isDisabled}
              label={t('Vote Aye')}
              onStart={toggleVoting}
              params={
                isCurrentVote
                  ? [referendumId, { Standard: { balance, vote: { aye: true, conviction } } }]
                  : [referendumId, { aye: true, conviction }]
              }
              tx={api.tx.democracy.vote}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check-to-slot'
        label={t('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default React.memo(Voting);
