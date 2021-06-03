// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { PropIndex, Proposal } from '@polkadot/types/interfaces';

import React, { useMemo, useState } from 'react';

import { Button, ConvictionDropdown, Modal, ProposedAction, TxButton, VoteAccount, VoteValue } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

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
  const [conviction, setConviction] = useState(0);
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
          header={t<string>('Vote on proposal')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('If this proposal is passed, the changes will be applied via dispatch and the deposit returned.')}>
              <ProposedAction
                idNumber={referendumId}
                proposal={proposal}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The vote will be recorded for this account. If another account delegated to this one, the delegated votes will also be counted.')}>
              <VoteAccount onChange={setAccountId} />
            </Modal.Columns>
            <Modal.Columns hint={
              <>
                <p>{t<string>('The balance associated with the vote will be locked as per the conviction specified and will not be available for transfer during this period.')}</p>
                <p>{t<string>('Conviction locks do overlap and is additive, meaning that funds locked during a previous vote can be locked again.')}</p>
              </>
            }>
              {isCurrentVote && (
                <VoteValue
                  accountId={accountId}
                  autoFocus
                  onChange={setBalance}
                />
              )}
              <ConvictionDropdown
                help={t<string>('The conviction to use for this vote, with an appropriate lock period.')}
                label={t<string>('conviction')}
                onChange={setConviction}
                value={conviction}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleVoting}>
            <TxButton
              accountId={accountId}
              icon='ban'
              isDisabled={isDisabled}
              label={t<string>('Vote Nay')}
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
              label={t<string>('Vote Aye')}
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
        icon='check'
        label={t<string>('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default React.memo(Voting);
