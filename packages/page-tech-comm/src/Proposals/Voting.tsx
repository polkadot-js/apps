// Copyright 2017-2025 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CollectiveType } from '@polkadot/react-hooks/types';
import type { Hash } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { Button, MarkWarning, Modal, TxButton, VoteAccount } from '@polkadot/react-components';
import { useAccounts, useApi, useCollectiveInstance, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

interface Props {
  hash: Hash | string;
  isMember: boolean;
  members: string[];
  prime?: string | null;
  proposalId: BN | number;
  type: CollectiveType;
}

function Voting ({ hash, isMember, members, prime, proposalId, type }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVotingOpen, toggleVoting] = useToggle();
  const modLocation = useCollectiveInstance(type);

  if (!modLocation || !hasAccounts) {
    return null;
  }

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t('Vote on proposal')}
          onClose={toggleVoting}
          size='small'
        >
          <Modal.Content>
            <VoteAccount
              filter={members}
              onChange={setAccountId}
            />
            {accountId === prime && (
              <MarkWarning content={t('You are voting with this collective\'s prime account. The vote will be the default outcome in case of any abstentions.')} />
            )}
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='ban'
              label={t('Vote Nay')}
              onStart={toggleVoting}
              params={[hash, proposalId, false]}
              tx={api.tx[modLocation].vote}
            />
            <TxButton
              accountId={accountId}
              icon='check'
              label={t('Vote Aye')}
              onStart={toggleVoting}
              params={[hash, proposalId, true]}
              tx={api.tx[modLocation].vote}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check'
        isDisabled={!isMember}
        label={t('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default React.memo(Voting);
