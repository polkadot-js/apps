// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash, Proposal, ProposalIndex } from '@polkadot/types/interfaces';

import React, { useState } from 'react';
import { Button, InputAddress, Modal, ProposedAction, TxButton } from '@polkadot/react-components';
import { useApi, useToggle, useWeight } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  hasFailed: boolean;
  hash: Hash;
  idNumber: ProposalIndex;
  isDisabled: boolean;
  members: string[];
  proposal: Proposal;
}

function Close ({ hasFailed, hash, idNumber, isDisabled, members, proposal }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [proposalWeight, proposalLength] = useWeight(proposal);

  if (!api.tx.technicalCommittee.close) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <Modal
          header={t<string>('Close proposal')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <ProposedAction
                  idNumber={idNumber}
                  proposal={proposal}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The proposal that will be affected. Once closed for the current voting round, it would need to be re-submitted for a subsequent voting round.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  filter={members}
                  help={t<string>('Select the account you wish close the proposal with.')}
                  label={t<string>('sending account')}
                  onChange={setAccountId}
                  type='account'
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The committee account that will apply the close for the current round.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              onStart={toggleOpen}
              params={
                api.tx.technicalCommittee.close.meta.args.length === 4
                  ? hasFailed
                    ? [hash, idNumber, 0, 0]
                    : [hash, idNumber, proposalWeight, proposalLength]
                  : [hash, idNumber]
              }
              tx='technicalCommittee.close'
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='times'
        isDisabled={isDisabled}
        label={t<string>('Close')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Close);
