// Copyright 2017-2019 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, Modal, VoteAccount, VoteActions, VoteToggle } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  hash: string;
  proposalId: BN | number;
}

function Voting ({ hash, proposalId, t }: Props): React.ReactElement<Props> | null {
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [voteValue, setVoteValue] = useState(true);
  const [isVotingOpen, toggleVoting] = useToggle();

  if (!hasAccounts) {
    return null;
  }

  const _onChangeVote = (vote?: boolean): void => setVoteValue(isBoolean(vote) ? vote : true);

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t('Vote on proposal')}
          open
          size='small'
        >
          <Modal.Content>
            <VoteAccount onChange={setAccountId} />
            <VoteToggle
              onChange={_onChangeVote}
              value={voteValue}
            />
          </Modal.Content>
          <VoteActions
            accountId={accountId}
            onClick={toggleVoting}
            params={[hash, proposalId, voteValue]}
            tx='technicalCommittee.vote'
          />
        </Modal>
      )}
      <Button
        icon='check'
        isPrimary
        label={t('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default translate(Voting);
