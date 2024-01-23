// Copyright 2017-2024 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

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
      header= {t('Undelegate')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('You will remove any delegation made by this acccount')}>
          <InputAddress
            defaultValue={accountDelegating}
            isDisabled
            label={t('delegating account')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountDelegating}
          icon='sign-in-alt'
          label={t('Undelegate')}
          onStart={onClose}
          tx={api.tx.democracy.undelegate}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Undelegate);
