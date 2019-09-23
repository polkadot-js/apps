// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/react-api';

import translate from '../translate';

interface Props extends I18nProps {
  allAccounts?: SubjectInfo;
  referendumId: BN | number;
}

function Voting ({ allAccounts, referendumId, t }: Props): React.ReactElement<Props> | null {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [voteValue, setVoteValue] = useState(true);
  const hasAccounts = allAccounts && Object.keys(allAccounts).length !== 0;

  if (!hasAccounts) {
    return null;
  }

  const _toggleVoting = (): void => setIsVotingOpen(!isVotingOpen);

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
              onChange={setVoteValue}
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
                params={[referendumId, voteValue]}
                tx='democracy.vote'
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

export default withMulti(
  Voting,
  translate,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
