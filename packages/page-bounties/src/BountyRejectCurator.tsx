// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import React from 'react';

import { useBounties } from '@polkadot/app-bounties/hooks';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  curatorId: AccountId;
  index: BountyIndex;
  toggleOpen: () => void;
}

function BountyRejectCurator ({ curatorId, index, toggleOpen }: Props) {
  const { t } = useTranslation();
  const { unassignCurator } = useBounties();

  return (
    <Modal
      header={t<string>('reject curator')}
      size='large'
    >
      <Modal.Content>
        <Modal.Column>
          <p>{t<string>('This action will reject your candidacy for the curator of the bounty.')}</p>
        </Modal.Column>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              help={t<string>('This account will be used to create the unassign curator transaction.')}
              isDisabled
              label={t<string>('curator account')}
              type='account'
              value={curatorId.toString()}
              withLabel
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Only the account proposed as curator by the council can create the unassign curator transaction ')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={toggleOpen}>
        <TxButton
          accountId={curatorId}
          icon='times'
          label={t<string>('Reject')}
          onStart={toggleOpen}
          params={[index]}
          tx={unassignCurator}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BountyRejectCurator);
