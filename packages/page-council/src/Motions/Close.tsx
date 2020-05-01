// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash, Proposal, ProposalIndex } from '@polkadot/types/interfaces';

import React, { useState } from 'react';
import { Button, InputAddress, Modal, ProposedAction, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  hash: Hash;
  idNumber: ProposalIndex;
  isDisabled: boolean;
  members: string[];
  proposal: Proposal;
}

function Close ({ hash, idNumber, isDisabled, members, proposal }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);

  return (
    <>
      {isOpen && (
        <Modal
          header={t('Close proposal')}
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
                <p>{t('The proposal that will be affected. Once closed for the current voting round, it would need to be re-submitted to council for a subsequent voting round.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  filter={members}
                  help={t('Select the account you wish close the proposal with.')}
                  label={t('sending account')}
                  onChange={setAccountId}
                  type='account'
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t('The council account that will apply the close for the current round.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              onStart={toggleOpen}
              params={[hash, idNumber]}
              tx='council.close'
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='cancel'
        isDisabled={isDisabled}
        label={t('Close')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Close);
