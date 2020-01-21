// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash, Proposal } from '@polkadot/types/interfaces';
import { TxSource } from '@polkadot/react-hooks/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { useApi, useTxModal } from '@polkadot/react-hooks';

import { Button, ProposedAction, Modal, TxAccount, TxActions, VoteToggle } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  collective: 'council' | 'technicalCommittee';
  hash: Hash;
  header: React.ReactNode;
  idNumber: BN | number;
  proposal?: Proposal | null;
}

export default function Voting ({ collective, hash, header, idNumber, proposal }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [voteValue, setVoteValue] = useState(true);

  const { isOpen, isSubmittable, onChangeAccountId, onClose, onOpen, sendTx } = useTxModal(
    (): TxSource => ({
      tx: api.tx[collective].vote(hash.toString(), idNumber, voteValue),
      isSubmittable: !!hash
    }),
    [hash, idNumber, voteValue]
  );

  return (
    <>
      <div className='ui--Row-buttons'>
        <Button
          isPrimary
          label={t('Vote')}
          icon='check'
          onClick={onOpen}
        />
      </div>
      <Modal
        header={header}
        open={isOpen}
        onClose={onClose}
        small
      >
        <Modal.Content>
          <ProposedAction
            idNumber={idNumber}
            isCollapsible
            proposal={proposal}
          />
          <br />
          <br />
          <TxAccount
            label={t('vote with account')}
            onChange={onChangeAccountId}
          />
          <VoteToggle
            onChange={setVoteValue}
            value={voteValue}
          />
        </Modal.Content>
        <TxActions
          isSubmittable={isSubmittable}
          onCancel={onClose}
          onSend={sendTx}
        />
      </Modal>
    </>
  );
}
