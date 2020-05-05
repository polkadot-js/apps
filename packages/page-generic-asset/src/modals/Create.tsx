// Copyright 2017-2020 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, Input, InputNumber, Modal } from '@polkadot/react-components';

import { useTranslation } from '../translate';

export interface ModalProps {
  onClose: () => void;
  onRegister: (id: BN, name: string) => void;
}

interface Props extends ModalProps {
  className?: string;
}

function Create ({ onClose, onRegister }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [assetId, setAssetId] = useState(new BN(0));
  const [name, setName] = useState('new asset');

  const _onChangeAssetId = (assetId: BN | undefined): void => setAssetId(assetId || new BN(0));

  const _onCommit = (): void => {
    onRegister(assetId, name);
    onClose();
  };

  return (
    <Modal header={t('Register an Asset')}>
      <Modal.Content>
        <InputNumber
          help={t('Enter the Asset ID of the token you want to manage.')}
          label={t('asset id')}
          onChange={_onChangeAssetId}
          onEnter={_onCommit}
          value={assetId}
        />
        <Input
          className='full'
          help={t('Type the name of this Asset. This name will be used across all the apps. It can be edited later on.')}
          isError={!name}
          label={t('name')}
          onChange={setName}
          onEnter={_onCommit}
          value={name}
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='registered'
          isDisabled={!name}
          isPrimary
          label={t('Register')}
          onClick={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Create);
