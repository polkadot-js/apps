// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { ComponentProps as Props } from './types';

import BN from 'bn.js';
import React, { useRef, useMemo, useState } from 'react';
import { useAccountId, useApi, useModal } from '@polkadot/react-hooks';
import { InputAddressMulti, Button, Modal, TxButton, VoteAccount } from '@polkadot/react-components';
import VoteValue from './VoteValue';

import { useTranslation } from '../translate';

const MAX_VOTES = 16;

export default function Vote ({ electionsInfo: { candidates, members, runnersUp } }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [votes, setVotes] = useState<string[]>([]);
  const [voteValue, setVoteValue] = useState<BN>(new BN(0));
  const { isOpen, onOpen, onClose } = useModal();

  const _fetchVotes = (accountId: StringOrNull): void => {
    (api.query.electionPhragmen || api.query.elections)
      .votesOf<[AccountId[]] & Codec>(accountId || undefined)
      .then(([existingVotes]): void => {
        setVotes(existingVotes.map((accountId): string => accountId.toString()));
      });
  };

  const [accountId, onChangeAccountId] = useAccountId(null, _fetchVotes);
  const onSendRef = useRef<() => void>();
  const available = useMemo(() =>
    members
      .map(([accountId]): string => accountId.toString())
      .concat(runnersUp.map(([accountId]): string => accountId.toString()))
      .concat(candidates.map((accountId): string => accountId.toString()))
  , [candidates, members, runnersUp]);

  return (
    <>
      <Button
        isDisabled={available.length === 0}
        isPrimary
        label={t('Vote')}
        icon='check'
        onClick={onOpen}
      />
      {isOpen && (
        <Modal
          header={t('Vote for current candidates')}
          onClose={onClose}
          small
        >
          <Modal.Content>
            <VoteAccount
              filter={members.map(([accountId]): string => accountId.toString())}
              onChange={onChangeAccountId}
            />
            <VoteValue
              accountId={accountId}
              onChange={setVoteValue}
              onEnter={onSendRef.current}
              onEscape={onClose}
            />
            <InputAddressMulti
              available={available}
              help={t('Filter available candidates based on name, address or short account index.')}
              label={t('filter candidates')}
              maxCount={MAX_VOTES}
              onChange={setVotes}
              value={votes}
            />
          </Modal.Content>
          <Modal.Actions onCancel={onClose}>
            <TxButton
              accountId={accountId}
              isDisabled={!votes.some((vote): boolean => !!vote)}
              onStart={onClose}
              onSendRef={onSendRef}
              params={[votes, voteValue]}
              tx={`${api.tx.electionPhragmen ? 'electionPhragmen' : 'elections'}.vote`}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}
