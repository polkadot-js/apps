// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ProposalIndex } from '@polkadot/types/interfaces';

import React, { useEffect, useRef, useState } from 'react';
import { getTreasuryThreshold } from '@polkadot/app-council/thresholds';
import { Button, Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  id: ProposalIndex;
  isDisabled: boolean;
  members: string[];
}

interface ProposalState {
  proposal?: SubmittableExtrinsic<'promise'> | null;
  proposalLength: number;
}

function Council ({ id, isDisabled, members }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [councilType, setCouncilType] = useState('accept');
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>({ proposalLength: 0 });

  const threshold = Math.ceil((members?.length || 0) * getTreasuryThreshold(api));

  const councilTypeOptRef = useRef([
    { text: t<string>('Acceptance proposal to council'), value: 'accept' },
    { text: t<string>('Rejection proposal to council'), value: 'reject' }
  ]);

  useEffect((): void => {
    const proposal = councilType === 'reject'
      ? api.tx.treasury.rejectProposal(id)
      : api.tx.treasury.approveProposal(id);

    setProposal({ proposal, proposalLength: proposal.length });
  }, [api, councilType, id]);

  return (
    <>
      {isOpen && (
        <Modal
          header={t<string>('Send to council')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  filter={members}
                  help={t<string>('Select the council account you wish to use to make the proposal.')}
                  label={t<string>('submit with council account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The council member that is proposing this, submission equates to an "aye" vote.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <Dropdown
                  help={t<string>('The type of council proposal to submit.')}
                  label={t<string>('council proposal type')}
                  onChange={setCouncilType}
                  options={councilTypeOptRef.current}
                  value={councilType}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Proposal can either be to approve or reject this spend. One approved, the change is applied by either removing the proposal or scheduling payout.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='check'
              isDisabled={!accountId || !threshold}
              label={t<string>('Send to council')}
              onStart={toggleOpen}
              params={
                api.tx.council.propose.meta.args.length === 3
                  ? [threshold, proposal, proposalLength]
                  : [threshold, proposal]
              }
              tx='council.propose'
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='step-forward'
        isDisabled={isDisabled}
        label={t<string>('To council')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Council);
