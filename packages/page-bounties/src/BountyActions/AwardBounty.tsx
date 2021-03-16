// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import React, { useMemo, useState } from 'react';

import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';

import { truncateTitle } from '../helpers';
import { useBounties } from '../hooks';
import { useTranslation } from '../translate';

interface Props {
  curatorId: AccountId;
  description: string;
  index: BountyIndex;
}

function AwardBounty ({ curatorId, description, index }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { awardBounty } = useBounties();
  const { allAccounts } = useAccounts();
  const [isOpen, toggleOpen] = useToggle();
  const [beneficiaryId, setBeneficiaryId] = useState<string | null>(null);
  const isCurator = useMemo(() => allAccounts.includes(curatorId.toString()), [allAccounts, curatorId]);

  return isCurator
    ? (
      <>
        <Button
          icon='award'
          isDisabled={false}
          label={t<string>('Reward implementer')}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={`${t<string>('award bounty')} - "${truncateTitle(description, 30)}"`}
            size='large'
          >
            <Modal.Content>
              <Modal.Columns hint={t<string>('The Curator account that will be used to send this transaction. Any applicable fees will be paid by this account.')}>
                <InputAddress
                  defaultValue={curatorId}
                  help={t<string>("Curator's account that will reward the bounty to the implementer.")}
                  isDisabled={true}
                  label={t<string>('award with account')}
                  type='account'
                  withLabel
                />
              </Modal.Columns>
              <Modal.Columns hint={t<string>("Reward the bounty to an implementer's account. The implementer will be able to claim the funds after a delay period.")}>
                <InputAddress
                  help={t<string>('Choose the Beneficiary for this bounty.')}
                  label={t<string>('implementer account')}
                  onChange={setBeneficiaryId}
                  withLabel
                />
              </Modal.Columns>
            </Modal.Content>
            <Modal.Actions onCancel={toggleOpen}>
              <TxButton
                accountId={curatorId}
                icon='check'
                label={t<string>('Approve')}
                onStart={toggleOpen}
                params={[index, beneficiaryId]}
                tx={awardBounty}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    )
    : null;
}

export default React.memo(AwardBounty);
