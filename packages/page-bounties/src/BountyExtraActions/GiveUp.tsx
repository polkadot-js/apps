// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import React from 'react';

import { useBounties } from '@polkadot/app-bounties/hooks';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  curatorId: AccountId;
  index: BountyIndex;
  toggleOpen: () => void;
}

function BountyGiveUpCurator ({ curatorId, index, toggleOpen }: Props) {
  const { t } = useTranslation();
  const { unassignCurator } = useBounties();

  return (
    <Modal
      header={t<string>("Give up curator's role")}
      size='large'
    >
      <Modal.Content>
        <Modal.Column>
          <p>{t<string>('This action will unassign you from the curator role.')}</p>
        </Modal.Column>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              help={t<string>('The Curator account that will give up on it\'s role.')}
              isDisabled
              label={t<string>('curator account')}
              type='account'
              value={curatorId.toString()}
              withLabel
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('You are giving up your curator role, the bounty will return to the Funded state. You will get your deposit back.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={toggleOpen}>
        <TxButton
          accountId={curatorId}
          icon='check'
          label={t<string>('Give Up')}
          onStart={toggleOpen}
          params={[index]}
          tx={unassignCurator}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BountyGiveUpCurator);
