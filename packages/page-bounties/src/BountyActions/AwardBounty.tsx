// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import React, { useMemo, useState } from 'react';

import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';

import { useBounties } from '../hooks';
import { useTranslation } from '../translate';

interface Props {
  curatorId: AccountId
  index: BountyIndex;
}

function AwardBounty ({ curatorId, index }: Props): React.ReactElement<Props> | null {
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
          label={t<string>('Award Beneficiary')}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={t<string>('award bounty')}
            size='large'
          >
            <Modal.Content>
              <Modal.Column>
                <p>{t<string>('This action will award the Beneficiary and close the bounty after a delay.')}</p>
              </Modal.Column>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    defaultValue={curatorId}
                    help={t<string>("Curator's account that will award a bounty to the Beneficiary.")}
                    isDisabled={true}
                    label={t<string>('award with account')}
                    type='account'
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('The Curator account that will be used to send this transaction. Any applicable fees will be paid by this account.')}</p>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    help={t<string>('Choose the Beneficiary for this bounty.')}
                    label={t<string>('beneficiary account')}
                    onChange={setBeneficiaryId}
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('Award bounty to a beneficiary account. The beneficiary will be able to claim the funds after a delay.')}</p>
                </Modal.Column>
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
