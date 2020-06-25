// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Hash } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Icon, Modal, VoteAccount, VoteActions, VoteToggle } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  hash: Hash | string;
  prime?: AccountId | null;
  proposalId: BN | number;
}

function Voting ({ hash, prime, proposalId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVotingOpen, toggleVoting] = useToggle();
  const [voteValue, setVoteValue] = useState(true);

  useEffect((): void => {
    isVotingOpen && setVoteValue(true);
  }, [isVotingOpen]);

  const _onChangeVote = useCallback(
    (vote?: boolean): void => setVoteValue(isBoolean(vote) ? vote : true),
    []
  );

  if (!hasAccounts) {
    return null;
  }

  const isPrime = accountId === prime?.toString();

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t<string>('Vote on proposal')}
          size='small'
        >
          <Modal.Content>
            <VoteAccount onChange={setAccountId} />
            <VoteToggle
              onChange={_onChangeVote}
              value={voteValue}
            />
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
            params={[hash, proposalId, voteValue]}
            tx='technicalCommittee.vote'
          />
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
