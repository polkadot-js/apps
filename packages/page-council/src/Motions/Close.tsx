// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash, Proposal, ProposalIndex } from '@polkadot/types/interfaces';

import React, { useState } from 'react';
import { Button, InputAddress, Modal, ProposedAction, TxButton } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  hash: Hash;
  idNumber: ProposalIndex;
  proposal: Proposal;
}

function Close ({ hash, idNumber, proposal }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);

  if (!hasAccounts) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <Modal
          header={t('Close proposal')}
          size='small'
        >
          <Modal.Content>
            <ProposedAction
              idNumber={idNumber}
              proposal={proposal}
            />
            <InputAddress
              help={t('Select the account you wish close the proposal with.')}
              label={t('sending account')}
              onChange={setAccountId}
              type='account'
            />
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
        label={t('Close')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Close);
