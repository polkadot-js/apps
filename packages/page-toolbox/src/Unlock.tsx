// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';

import React, { useCallback, useEffect, useState } from 'react';
import { AddressRow, Button, Modal, Password } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  onClose: () => void;
  onUnlock: () => void;
  pair: KeyringPair | null;
}

function Unlock ({ onClose, onUnlock, pair }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);

  useEffect((): void => {
    setAddress(pair?.address || '');
  }, [pair]);

  useEffect((): void => {
    setUnlockError(null);
  }, [password]);

  const _onUnlock = useCallback(
    (): void => {
      if (!pair || !pair.isLocked) {
        return;
      }

      try {
        pair.decodePkcs8(password);
      } catch (error) {
        return setUnlockError(error.message);
      }

      onUnlock();
    },
    [onUnlock, pair, password]
  );

  if (!pair) {
    return null;
  }

  return (
    <Modal
      className='toolbox--Unlock'
      header={t('Unlock account')}
    >
      <Modal.Content>
        <AddressRow
          isInline
          value={address}
        >
          <p>{t('You are about to unlock your account to allow for the signing of messages. Once active the signature will be generated based on the content provided.')}</p>
          <div>
            <Password
              autoFocus
              help={t('The account\'s password specified at the creation of this account.')}
              isError={!!unlockError}
              label={t('password')}
              onChange={setPassword}
              onEnter={_onUnlock}
              value={password}
            />
          </div>
        </AddressRow>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='unlock'
          isPrimary
          label={t('Unlock')}
          onClick={_onUnlock}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Unlock);
