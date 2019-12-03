// Copyright 2017-2019 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  hash: string;
  proposalId: BN | number;
}

function Voting ({ hash, proposalId, t }: Props): React.ReactElement<Props> | null {
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [voteValue, setVoteValue] = useState(true);

  if (!hasAccounts) {
    return null;
  }

  const _toggleVoting = (): void => setIsVotingOpen(!isVotingOpen);
  const _onChangeVote = (vote?: boolean): void => setVoteValue(isBoolean(vote) ? vote : true);

  return (
    <>
      {isVotingOpen && (
        <Modal
          dimmer='inverted'
          open
          size='small'
        >
          <Modal.Header>{t('Vote on proposal')}</Modal.Header>
          <Modal.Content>
            <InputAddress
              help={t('Select the account you wish to vote with. You can approve "aye" or deny "nay" the proposal.')}
              label={t('vote with account')}
              onChange={setAccountId}
              type='account'
              withLabel
            />
            <Dropdown
              help={t('Select your vote preferences for this proposal, either to approve or disapprove')}
              label={t('record my vote as')}
              options={[
                { text: t('Aye, I approve'), value: true },
                { text: t('Nay, I do not approve'), value: false }
              ]}
              onChange={_onChangeVote}
              value={voteValue}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button.Group>
              <Button
                icon='cancel'
                isNegative
                label={t('Cancel')}
                onClick={_toggleVoting}
              />
              <Button.Or />
              <TxButton
                accountId={accountId}
                icon='check'
                isDisabled={!accountId}
                isPrimary
                label={t('Vote')}
                onClick={_toggleVoting}
                params={[hash, proposalId, voteValue]}
                tx='technicalCommittee.vote'
              />
            </Button.Group>
          </Modal.Actions>
        </Modal>
      )}
      <div className='ui--Row-buttons'>
        <Button
          icon='check'
          isPrimary
          label={t('Vote')}
          onClick={_toggleVoting}
        />
      </div>
    </>
  );
}

export default translate(Voting);
