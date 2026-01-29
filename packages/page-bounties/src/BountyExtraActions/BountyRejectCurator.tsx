// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import React from 'react';

import { InputAddress, Modal, TxButton } from '@polkadot/react-components';

import { truncateTitle } from '../helpers/index.js';
import { useBounties } from '../hooks/index.js';
import { useTranslation } from '../translate.js';

interface Props {
  curatorId: AccountId;
  description: string;
  index: BountyIndex;
  toggleOpen: () => void;
}

function BountyRejectCurator ({ curatorId, description, index, toggleOpen }: Props) {
  const { t } = useTranslation();
  const { unassignCurator } = useBounties();

  return (
    <Modal
      header={`${t('reject curator')} - "${truncateTitle(description, 30)}"`}
      onClose={toggleOpen}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('Only the account proposed as curator by the council can create the unassign curator transaction ')}>
          <InputAddress
            isDisabled
            label={t('curator account')}
            type='account'
            value={curatorId.toString()}
            withLabel
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={curatorId}
          icon='times'
          label={t('Reject')}
          onStart={toggleOpen}
          params={[index]}
          tx={unassignCurator}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BountyRejectCurator);
