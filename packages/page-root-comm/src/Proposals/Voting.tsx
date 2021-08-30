// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

<<<<<<< HEAD
import type BN from 'bn.js';
import type { AccountId, Hash } from '@polkadot/types/interfaces';

import React, { useState } from 'react';

import { Button, MarkWarning, Modal, TxButton, VoteAccount } from '@polkadot/react-components';
import { useAccounts, useApi, useCollectiveInstance, useToggle } from '@polkadot/react-hooks';
=======
import type { AccountId, Hash } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useState } from 'react';

import { Button, MarkWarning, Modal, TxButton, VoteAccount } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
>>>>>>> ternoa-master

import { useTranslation } from '../translate';

interface Props {
  hash: Hash | string;
  members: string[];
  prime?: AccountId | null;
  proposalId: BN | number;
<<<<<<< HEAD
  type: 'membership' | 'rootCommittee';
}

function Voting({ hash, members, prime, proposalId, type }: Props): React.ReactElement<Props> | null {
=======
}

function Voting({ hash, members, prime, proposalId }: Props): React.ReactElement<Props> | null {
>>>>>>> ternoa-master
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVotingOpen, toggleVoting] = useToggle();
<<<<<<< HEAD
  const modLocation = useCollectiveInstance(type);

  if (!modLocation || !hasAccounts) {
=======

  if (!hasAccounts) {
>>>>>>> ternoa-master
    return null;
  }

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t<string>('Vote on proposal')}
<<<<<<< HEAD
          onClose={toggleVoting}
=======
>>>>>>> ternoa-master
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
<<<<<<< HEAD
          <Modal.Actions>
=======
          <Modal.Actions onCancel={toggleVoting}>
>>>>>>> ternoa-master
            <TxButton
              accountId={accountId}
              icon='ban'
              label={t<string>('Vote Nay')}
              onStart={toggleVoting}
              params={[hash, proposalId, false]}
<<<<<<< HEAD
              tx={api.tx[modLocation].vote}
=======
              tx={api.tx.rootCommittee.vote}
>>>>>>> ternoa-master
            />
            <TxButton
              accountId={accountId}
              icon='check'
              label={t<string>('Vote Aye')}
              onStart={toggleVoting}
              params={[hash, proposalId, true]}
<<<<<<< HEAD
              tx={api.tx[modLocation].vote}
=======
              tx={api.tx.rootCommittee.vote}
>>>>>>> ternoa-master
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
