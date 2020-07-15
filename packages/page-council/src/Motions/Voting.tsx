// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Hash, Proposal, ProposalIndex } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Icon, Modal, ProposedAction, VoteAccount, VoteActions, VoteToggle } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  hash: Hash;
  idNumber: ProposalIndex;
  isDisabled: boolean;
  members: string[];
  prime: AccountId | null;
  proposal: Proposal;
}

function Voting ({ hash, idNumber, isDisabled, members, prime, proposal }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [isVotingOpen, toggleVoting] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [voteValue, setVoteValue] = useState(true);

  useEffect((): void => {
    isVotingOpen && setVoteValue(true);
  }, [isVotingOpen]);

  const _onChangeVote = useCallback(
    (vote?: boolean) => setVoteValue(isBoolean(vote) ? vote : true),
    []
  );

  if (!hasAccounts) {
    return null;
  }

  const isPrime = prime?.toString() === accountId;

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t<string>('Vote on proposal')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <ProposedAction
                  idNumber={idNumber}
                  proposal={proposal}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The proposal that is being voted on. It will pass when the threshold is reached.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <VoteAccount
                  filter={members}
                  onChange={setAccountId}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The council account for this vote. The selection is filtered by the current members.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <VoteToggle
                  onChange={_onChangeVote}
                  value={voteValue}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The vote to record for this proposal, either for or against.')}</p>
              </Modal.Column>
            </Modal.Columns>
            {isPrime && (
              <article className='warning'>
                <div><Icon icon='exclamation-triangle' />{t<string>('You are voting with this collective\'s prime account. The vote will be the default outcome in case of any abstentions.')}</div>
              </article>
            )}
          </Modal.Content>
          <VoteActions
            accountId={accountId}
            aye={voteValue}
            onClick={toggleVoting}
            params={[hash, idNumber, voteValue]}
            tx='council.vote'
          />
        </Modal>
      )}
      <Button
        icon='check'
        isDisabled={isDisabled}
        label={t<string>('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default React.memo(Voting);
