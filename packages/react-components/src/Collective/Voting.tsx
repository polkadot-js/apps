// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash, Proposal } from '@polkadot/types/interfaces';
import { CollectiveProps } from './types';

import BN from 'bn.js';
import React, { useRef, useState } from 'react';
import { useAccountId, useAccounts, useModal } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import { Button, ProposedAction, Modal, TxButton, VoteAccount, VoteToggle } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props extends CollectiveProps {
  hash: Hash;
  header: React.ReactNode;
  idNumber: BN | number;
  isDisabled?: boolean;
  proposal?: Proposal | null;
}

export default function Voting ({ collective, hash, header, idNumber, isDisabled, members, proposal }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [accountId, onChangeAccountId] = useAccountId();
  const { isOpen, onOpen, onClose } = useModal();
  const [voteValue, setVoteValue] = useState(true);
  const onSendRef = useRef<() => void>();

  if (!hasAccounts) {
    return null;
  }

  const _onChangeVote = (vote?: boolean): void => setVoteValue(isBoolean(vote) ? vote : true);

  return (
    <>
      <div className='ui--Row-buttons'>
        <Button
          isDisabled={isDisabled}
          isPrimary
          label={t('Vote')}
          icon='check'
          onClick={onOpen}
        />
      </div>
      {isOpen && (
        <Modal
          header={header}
          onClose={onClose}
          small
        >
          <Modal.Content>
            <ProposedAction
              idNumber={idNumber}
              proposal={proposal}
            />
            <VoteAccount
              filter={members}
              onChange={onChangeAccountId}
            />
            <VoteToggle
              onChange={_onChangeVote}
              value={voteValue}
            />
          </Modal.Content>
          <Modal.Actions onCancel={onClose}>
            <TxButton
              accountId={accountId}
              isDisabled={!hash}
              onSendRef={onSendRef}
              onStart={onClose}
              params={[hash, idNumber, voteValue]}
              tx={`${collective}.vote`}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}
