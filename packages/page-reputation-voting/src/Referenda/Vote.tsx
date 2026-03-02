// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import type { VoteRecord } from '../types.js';

import React, { useMemo, useState } from 'react';

import { Button, Modal, TxButton, VoteAccount } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  id: BN;
}

function Vote ({ className, id }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVoteOpen, toggleVoteOpen] = useToggle();
  const [isRemoveOpen, toggleRemoveOpen] = useToggle();

  // Check if the selected account has voted on this poll
  const voteRecord = useCall<Option<VoteRecord>>(
    accountId ? api.query.reputationVoting?.voteOf : undefined,
    [accountId, id]
  );

  const { hasVoted, voteDirection } = useMemo(() => {
    if (!voteRecord?.isSome) {
      return { hasVoted: false, voteDirection: null };
    }

    const record = voteRecord.unwrap();

    return {
      hasVoted: true,
      voteDirection: record.direction.isAye ? 'Aye' : record.direction.isNay ? 'Nay' : null
    };
  }, [voteRecord]);

  if (!hasAccounts) {
    return null;
  }

  return (
    <>
      {isVoteOpen && (
        <Modal
          className={className}
          header={t('Vote on referendum')}
          onClose={toggleVoteOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The vote will be recorded for this account using your reputation as voting power.')}>
              <VoteAccount onChange={setAccountId} />
            </Modal.Columns>
            <Modal.Columns hint={t('Vote Aye to support the proposal or Nay to oppose it. Your current reputation will be used as voting power.')}>
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <p>{t('Your reputation will be used as voting power. No tokens are locked.')}</p>
              </div>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='ban'
              isDisabled={!accountId}
              label={t('Vote Nay')}
              onStart={toggleVoteOpen}
              params={[id, 'Nay']}
              tx={api.tx.reputationVoting.vote}
            />
            <TxButton
              accountId={accountId}
              icon='check'
              isDisabled={!accountId}
              label={t('Vote Aye')}
              onStart={toggleVoteOpen}
              params={[id, 'Aye']}
              tx={api.tx.reputationVoting.vote}
            />
          </Modal.Actions>
        </Modal>
      )}
      {isRemoveOpen && (
        <Modal
          className={className}
          header={t('Remove vote')}
          onClose={toggleRemoveOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The vote will be removed for this account.')}>
              <VoteAccount onChange={setAccountId} />
            </Modal.Columns>
            {hasVoted && (
              <Modal.Columns hint={t('Your current vote on this referendum.')}>
                <div style={{ padding: '1rem', textAlign: 'center' }}>
                  <p>
                    {t('You have voted')}: <strong>{voteDirection}</strong>
                  </p>
                  <p>{t('Removing your vote will return your voting power for other proposals.')}</p>
                </div>
              </Modal.Columns>
            )}
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='trash'
              isDisabled={!accountId || !hasVoted}
              label={t('Remove vote')}
              onStart={toggleRemoveOpen}
              params={[id]}
              tx={api.tx.reputationVoting.removeVote}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check-to-slot'
        label={t('Vote')}
        onClick={toggleVoteOpen}
      />
      <Button
        icon='trash-can'
        label={t('Remove')}
        onClick={toggleRemoveOpen}
      />
    </>
  );
}

export default React.memo(Vote);
