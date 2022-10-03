// Copyright 2017-2022 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash, Proposal, ProposalIndex } from '@polkadot/types/interfaces';

import React, { useState } from 'react';

import { Button, InputAddress, Modal, ProposedAction, TxButton } from '@polkadot/react-components';
import { useApi, useCollectiveInstance, useToggle, useWeight } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  hasFailed: boolean;
  hash: Hash;
  idNumber: ProposalIndex;
  proposal: Proposal | null;
}

function Close ({ hasFailed, hash, idNumber, proposal }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const { encodedCallLength, weight } = useWeight(proposal);
  const modLocation = useCollectiveInstance('council');

  // protect against older versions
  if (!modLocation) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <Modal
          header={t<string>('Close proposal')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The proposal that will be affected. Once closed for the current voting round, it would need to be re-submitted to council for a subsequent voting round.')}>
              <ProposedAction
                idNumber={idNumber}
                proposal={proposal}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The council account that will apply the close for the current round.')}>
              <InputAddress
                help={t<string>('Select the account you wish close the proposal with.')}
                label={t<string>('close from account')}
                onChange={setAccountId}
                type='account'
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              isDisabled={!hasFailed && !encodedCallLength}
              onStart={toggleOpen}
              params={
                api.tx[modLocation].close.meta.args.length === 4
                  ? hasFailed
                    ? [hash, idNumber, 0, 0]
                    : [hash, idNumber, weight, encodedCallLength]
                  : [hash, idNumber]
              }
              tx={api.tx[modLocation].closeOperational || api.tx[modLocation].close}
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
