// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PropIndex, Proposal } from '@polkadot/types/interfaces';

import React, { useMemo, useState } from 'react';
import { Button, Dropdown, Modal, ProposedAction, VoteAccount, VoteActions, VoteToggle } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  proposal?: Proposal;
  referendumId: PropIndex;
}

export default function Voting ({ proposal, referendumId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [conviction, setConviction] = useState(0);
  const [isVotingOpen, toggleVoting] = useToggle();
  const [aye, setVoteValue] = useState(true);
  const convictionOpts = useMemo(() => [
    { text: t('0.1x of voting balance, no lockup period'), value: 0 },
    { text: t('1x of voting balance, locked for 1x enactment'), value: 1 },
    { text: t('2x of voting balance, locked for 2x enactment'), value: 2 },
    { text: t('3x of voting balance, locked for 4x enactment'), value: 3 },
    { text: t('4x of voting balance, locked for 8x enactment'), value: 4 },
    { text: t('5x of voting balance, locked for 16x enactment'), value: 5 },
    { text: t('6x of voting balance, locked for 32x enactment'), value: 6 }
  ], [t]);

  if (!hasAccounts) {
    return null;
  }

  const _onChangeVote = (vote?: boolean): void => setVoteValue(isBoolean(vote) ? vote : true);

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t('Vote on proposal')}
          size='small'
        >
          <Modal.Content>
            <ProposedAction
              idNumber={referendumId}
              proposal={proposal}
            />
            <VoteAccount onChange={setAccountId} />
            <VoteToggle
              onChange={_onChangeVote}
              value={aye}
            />
            <Dropdown
              help={t('The conviction to use for this vote, with an appropriate lock period.')}
              label={t('conviction')}
              onChange={setConviction}
              options={convictionOpts}
              value={conviction}
            />
          </Modal.Content>
          <VoteActions
            accountId={accountId}
            onClick={toggleVoting}
            params={[referendumId, { aye, conviction }]}
            tx='democracy.vote'
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
