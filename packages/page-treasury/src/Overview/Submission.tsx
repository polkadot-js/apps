// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposal } from '@polkadot/api-derive/types';
import { ProposalIndex } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';
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
    transform: (value: any[]): number =>
      Math.ceil(value.length * 0.6)
  });
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [councilType, setCouncilType] = useState('reject');
  const [hasProposals, setHasProposals] = useState(true);
  const councilTypeOpt = useMemo(() => [
    { value: 'accept', text: t('Acceptance proposal to council') },
    { value: 'reject', text: t('Rejection proposal to council') }
  ], [t]);

  useEffect((): void => {
    setHasProposals(
      !!councilProposals
        .map(({ votes }): number => votes ? votes?.index.toNumber() : -1)
        .filter((index): boolean => index !== -1)
        .length
    );
  }, [councilProposals]);

  if (hasProposals) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <Modal
          header={t('Submit to council')}
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
              options={councilTypeOpt}
              value={councilType}
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='check'
              isDisabled={!accountId || !councilThreshold}
              isPrimary
              label={t('Send to council')}
              onStart={toggleOpen}
              params={[
                councilThreshold,
                councilType === 'reject'
                  ? api.tx.treasury.rejectProposal(id)
                  : api.tx.treasury.approveProposal(id)
              ]}
              tx='council.propose'
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check'
        isDisabled={isDisabled}
        label={t('Send to council')}
        onClick={toggleOpen}
      />
    </>
  );
}
