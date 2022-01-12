// Copyright 2017-2022 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Hash } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { Button, MarkWarning, Modal, TxButton, VoteAccount } from '@polkadot/react-components';
import { useAccounts, useApi, useCollectiveInstance, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  hash: Hash | string;
  isMember: boolean;
  members: string[];
  prime?: AccountId | null;
  proposalId: BN | number;
  type: 'membership' | 'technicalCommittee';
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
          header={t<string>('Vote on proposal')}
          onClose={toggleVoting}
          size='small'
        >
          <Modal.Content>
            <VoteAccount
              filter={members}
              onChange={setAccountId}
            />
            {(accountId === prime?.toString()) && (
              <MarkWarning content={t<string>('You are voting with this collective\'s prime account. The vote will be the default outcome in case of any abstentions.')} />
            )}
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='ban'
              label={t<string>('Vote Nay')}
              onStart={toggleVoting}
              params={[hash, proposalId, false]}
              tx={api.tx[modLocation].vote}
            />
            <TxButton
              accountId={accountId}
              icon='check'
              label={t<string>('Vote Aye')}
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
        label={t<string>('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default React.memo(Voting);
