// Copyright 2017-2019 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposal } from '@polkadot/api-derive/types';
import { ProposalIndex } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { Button, Dropdown, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  councilProposals: DerivedCollectiveProposal[];
  id: ProposalIndex;
  isDisabled: boolean;
}

export default function Submission ({ councilProposals, id, isDisabled }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const councilThreshold = useCall<number>(api.query.electionsPhragmen?.members || api.query.elections.members, [], {
    transform: (value: any[]): number => (value.length / 2) + 1
  });
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [councilType, setCouncilType] = useState('reject');
  const [hasProposals, setHasProposals] = useState(true);

  useEffect((): void => {
    const available = councilProposals
      .map(({ votes }): number =>
        votes ? votes?.index.toNumber() : -1
      )
      .filter((index): boolean => index !== -1);

    setHasProposals(!!available.length);
  }, [councilProposals]);

  if (hasProposals) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <Modal
          header={t('Submit to council')}
          open
          size='small'
        >
          <Modal.Content>
            <InputAddress
              help={t('Select the council account you wish to use to make the proposal.')}
              label={t('submit with council account')}
              onChange={setAccountId}
              type='account'
              withLabel
            />
            <Dropdown
              help={t('The type of council proposal to submit.')}
              label={t('council proposal type')}
              onChange={setCouncilType}
              options={[
                { value: 'accept', text: t('Acceptance proposal to council') },
                { value: 'reject', text: t('Rejection proposal to council') }
              ]}
              value={councilType}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button.Group>
              <Button
                icon='cancel'
                isNegative
                label={t('Cancel')}
                onClick={toggleOpen}
              />
              <Button.Or />
              <TxButton
                accountId={accountId}
                icon='check'
                isDisabled={!accountId || !councilThreshold}
                isPrimary
                label={t('Send to council')}
                onClick={toggleOpen}
                params={[
                  councilThreshold,
                  councilType === 'reject'
                    ? api.tx.treasury.rejectProposal(id)
                    : api.tx.treasury.approveProposal(id)
                ]}
                tx='council.propose'
              />
            </Button.Group>
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check'
        isDisabled={isDisabled}
        isPrimary
        label={t('Send to council')}
        onClick={toggleOpen}
      />
    </>
  );
}
