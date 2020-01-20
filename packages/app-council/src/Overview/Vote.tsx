// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';
import { TxSource } from '@polkadot/react-hooks/types';
import { AccountId } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { ComponentProps as Props } from './types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { useApi, useTxModal } from '@polkadot/react-hooks';
import { AddressMulti, Button, Modal, TxAccount, TxActions } from '@polkadot/react-components';
import VoteValue from './VoteValue';

import { useTranslation } from '../translate';

const MAX_VOTES = 16;

export default function Vote ({ electionsInfo: { candidates, members, runnersUp } }: Props): React.ReactElement<Props> {
  const [votes, setVotes] = useState<string[]>([]);
  const [voteValue, setVoteValue] = useState<BN>(new BN(0));

  const { api } = useApi();
  const { t } = useTranslation();

  const _fetchVotes = (accountId: StringOrNull): void => {
    (api.query.electionPhragmen || api.query.elections)
      .votesOf<[AccountId[]] & Codec>(accountId || undefined)
      .then(([existingVotes]): void => {
        setVotes(existingVotes.map((accountId): string => accountId.toString()));
      });
  };

  const { accountId, isOpen, isSubmittable, onChangeAccountId, onClose, onOpen, sendTx } = useTxModal(
    (): TxSource => ({
      tx: (api.tx.electionPhragmen?.vote || api.tx.elections.vote)(
        votes,
        voteValue
      ),
      isSubmittable: votes.some((vote): boolean => !!vote)
    }),
    [votes, voteValue],
    { onChangeAccountId: _fetchVotes }
  );

  const available = members
    .map(([accountId]): string => accountId.toString())
    .concat(runnersUp.map(([accountId]): string => accountId.toString()))
    .concat(candidates.map((accountId): string => accountId.toString()));

  return (
    <>
      <Button
        isDisabled={available.length === 0}
        isPrimary
        label={t('Vote')}
        icon='check'
        onClick={onOpen}
      />
      <Modal
        header={t('Vote for current candidates')}
        open={isOpen}
        onClose={onClose}
        small
      >
        <Modal.Content>
          <TxAccount
            help={t('Select the account with which to cast your vote.')}
            label={t('vote with account')}
            onChange={onChangeAccountId}
          />
          <VoteValue
            accountId={accountId}
            onChange={setVoteValue}
            onEnter={sendTx}
            onEscape={onClose}
          />
          <AddressMulti
            available={available}
            help={t('Filter available candidates based on name, address or short account index.')}
            label={t('filter candidates')}
            maxCount={MAX_VOTES}
            onChange={setVotes}
            value={votes}
          />
        </Modal.Content>
        <TxActions
          isSubmittable={isSubmittable}
          onCancel={onClose}
          onSend={sendTx}
          submitButtonLabel={t('Vote')}
        />
      </Modal>
    </>
  );
}
