// Copyright 2017-2025 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Hash, Proposal, ProposalIndex } from '@polkadot/types/interfaces';

import React, { useState } from 'react';

import { Button, MarkWarning, Modal, TxButton, VoteAccount } from '@polkadot/react-components';
import { useAccounts, useApi, useCollectiveInstance, useToggle } from '@polkadot/react-hooks';
import { ProposedAction } from '@polkadot/react-params';

import { useTranslation } from '../translate.js';

interface Props {
  hash: Hash;
  idNumber: ProposalIndex;
  isDisabled: boolean;
  members: string[];
  prime?: AccountId | null;
  proposal: Proposal | null;
}

function Voting ({ hash, idNumber, isDisabled, members, prime, proposal }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [isVotingOpen, toggleVoting] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const modLocation = useCollectiveInstance('council');

  if (!hasAccounts || !modLocation) {
    return null;
  }

  const isPrime = prime?.toString() === accountId;

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t('Vote on proposal')}
          onClose={toggleVoting}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The proposal that is being voted on. It will pass when the threshold is reached.')}>
              <ProposedAction
                idNumber={idNumber}
                proposal={proposal}
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The council account for this vote. The selection is filtered by the current members.')}>
              <VoteAccount
                filter={members}
                onChange={setAccountId}
              />
              {isPrime && (
                <MarkWarning content={t('You are voting with this collective\'s prime account. The vote will be the default outcome in case of any abstentions.')} />
              )}
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='ban'
              isDisabled={isDisabled}
              label={t('Vote Nay')}
              onStart={toggleVoting}
              params={[hash, idNumber, false]}
              tx={api.tx[modLocation].vote}
            />
            <TxButton
              accountId={accountId}
              icon='check-to-slot'
              isDisabled={isDisabled}
              label={t('Vote Aye')}
              onStart={toggleVoting}
              params={[hash, idNumber, true]}
              tx={api.tx[modLocation].vote}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check-to-slot'
        isDisabled={isDisabled}
        label={t('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default React.memo(Voting);
