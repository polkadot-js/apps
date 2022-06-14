// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import React from 'react';

import { InputAddress, Modal, TxButton } from '@polkadot/react-components';

import { truncateTitle } from '../helpers';
import { useBounties } from '../hooks';
import { useTranslation } from '../translate';

interface Props {
  curatorId: AccountId;
  description: string;
  index: BountyIndex;
  toggleOpen: () => void;
}

function BountyGiveUpCurator ({ curatorId, description, index, toggleOpen }: Props) {
  const { t } = useTranslation();
  const { unassignCurator } = useBounties();

  return (
    <Modal
      header={`${t<string>("give up curator's role")} - "${truncateTitle(description, 30)}"`}
      onClose={toggleOpen}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('You are giving up your curator role, the bounty will return to the Funded state. You will get your deposit back.')}>
          <InputAddress
            help={t<string>('The Curator account that will give up on it\'s role.')}
            isDisabled
            label={t<string>('curator account')}
            type='account'
            value={curatorId.toString()}
            withLabel
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={curatorId}
          icon='check'
          label={t<string>('Give up')}
          onStart={toggleOpen}
          params={[index]}
          tx={unassignCurator}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BountyGiveUpCurator);
