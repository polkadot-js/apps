// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash, Proposal, ProposalIndex } from '@polkadot/types/interfaces';

import React, { useState } from 'react';

import { Button, InputAddress, Modal, ProposedAction, TxButton } from '@polkadot/react-components';
<<<<<<< HEAD
import { useApi, useCollectiveInstance, useToggle, useWeight } from '@polkadot/react-hooks';
=======
import { useApi, useToggle, useWeight } from '@polkadot/react-hooks';
>>>>>>> ternoa-master

import { useTranslation } from '../translate';

interface Props {
  hasFailed: boolean;
  hash: Hash;
  idNumber: ProposalIndex;
  members: string[];
  proposal: Proposal;
<<<<<<< HEAD
  type: 'membership' | 'financialCommittee';
}

function Close({ hasFailed, hash, idNumber, members, proposal, type }: Props): React.ReactElement<Props> | null {
=======
}

function Close({ hasFailed, hash, idNumber, members, proposal }: Props): React.ReactElement<Props> | null {
>>>>>>> ternoa-master
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [proposalWeight, proposalLength] = useWeight(proposal);
<<<<<<< HEAD
  const modLocation = useCollectiveInstance(type);

  if (!modLocation) {
=======

  if (!api.tx.financialCommittee.close) {
>>>>>>> ternoa-master
    return null;
  }

  return (
    <>
      {isOpen && (
        <Modal
          header={t<string>('Close proposal')}
<<<<<<< HEAD
          onClose={toggleOpen}
=======
>>>>>>> ternoa-master
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The proposal that will be affected. Once closed for the current voting round, it would need to be re-submitted for a subsequent voting round.')}>
              <ProposedAction
                idNumber={idNumber}
                proposal={proposal}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The committee account that will apply the close for the current round.')}>
              <InputAddress
                filter={members}
                help={t<string>('Select the account you wish close the proposal with.')}
                label={t<string>('sending account')}
                onChange={setAccountId}
                type='account'
              />
            </Modal.Columns>
          </Modal.Content>
<<<<<<< HEAD
          <Modal.Actions>
=======
          <Modal.Actions onCancel={toggleOpen}>
>>>>>>> ternoa-master
            <TxButton
              accountId={accountId}
              onStart={toggleOpen}
              params={
<<<<<<< HEAD
                api.tx[modLocation].close.meta.args.length === 4
=======
                api.tx.financialCommittee.close.meta.args.length === 4
>>>>>>> ternoa-master
                  ? hasFailed
                    ? [hash, idNumber, 0, 0]
                    : [hash, idNumber, proposalWeight, proposalLength]
                  : [hash, idNumber]
              }
<<<<<<< HEAD
              tx={api.tx[modLocation].closeOperational || api.tx[modLocation].close}
=======
              tx={api.tx.financialCommittee.closeOperational || api.tx.financialCommittee.close}
>>>>>>> ternoa-master
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='times'
        label={t<string>('Close')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Close);
