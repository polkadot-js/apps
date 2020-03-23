// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';

interface Props {
  controllerId: string;
  onClose: () => void;
}

const EMPTY_PROOF = new Uint8Array();

function SetSessionKey ({ controllerId, onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [keys, setKeys] = useState<string | null>(null);

  return (
    <Modal
      className='staking--SetSessionAccount'
      header={t('Set Session Key')}
      size='small'
    >
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          defaultValue={controllerId}
          isDisabled
          label={t('controller account')}
        />
        <Input
          autoFocus
          className='medium'
          help={t('Changing the key only takes effect at the start of the next session. The input here is generates from the author_rotateKeys command')}
          isError={!keys}
          label={t('Keys from rotateKeys')}
          onChange={setKeys}
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          isDisabled={!keys}
          isPrimary
          label={t('Set Session Key')}
          icon='sign-in'
          onStart={onClose}
          params={[keys, EMPTY_PROOF]}
          tx='session.setKeys'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(SetSessionKey);
