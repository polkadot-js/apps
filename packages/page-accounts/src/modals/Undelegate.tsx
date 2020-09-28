// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  accountDelegating: string | null;
  onClose: () => void;
}

function Undelegate ({ accountDelegating, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Modal
      className='staking--Undelegate'
      header= {t<string>('Undelegate')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={accountDelegating}
              isDisabled
              label={t<string>('delegating account')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('You will remove any delegation made by this acccount')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountDelegating}
          icon='sign-in-alt'
          label={t<string>('Undelegate')}
          onStart={onClose}
          params={[]}
          tx='democracy.undelegate'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Undelegate);
