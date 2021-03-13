// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  accountDelegating: string | null;
  onClose: () => void;
}

function Undelegate ({ accountDelegating, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  return (
    <Modal
      className='staking--Undelegate'
      header= {t<string>('Undelegate')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('You will remove any delegation made by this acccount')}>
          <InputAddress
            defaultValue={accountDelegating}
            isDisabled
            label={t<string>('delegating account')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountDelegating}
          icon='sign-in-alt'
          label={t<string>('Undelegate')}
          onStart={onClose}
          tx={api.tx.democracy.undelegate}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Undelegate);
