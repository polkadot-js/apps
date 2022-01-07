// Copyright 2017-2022 @polkadot/app-signing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from '@polkadot/keyring/types';

import React, { useCallback, useEffect, useState } from 'react';

import { Button, InputAddress, Modal, Password } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  onClose: () => void;
  onUnlock: () => void;
  pair: KeyringPair | null;
}

function Unlock ({ onClose, onUnlock, pair }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
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

      setIsBusy(true);
      setTimeout((): void => {
        try {
          pair.decodePkcs8(password);
        } catch (error) {
          setIsBusy(false);

          return setUnlockError((error as Error).message);
        }

        setIsBusy(false);
        onUnlock();
      }, 0);
    },
    [onUnlock, pair, password]
  );

  if (!pair) {
    return null;
  }

  return (
    <Modal
      className='toolbox--Unlock'
      header={t<string>('Unlock account')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('This account that will perform the message signing.')}>
          <InputAddress
            help={t<string>('The selected account to be unlocked.')}
            isDisabled
            label={t<string>('account')}
            value={address}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('Unlock the account for signing. Once active the signature will be generated based on the content provided.')}>
          <Password
            autoFocus
            help={t<string>('The account\'s password specified at the creation of this account.')}
            isError={!!unlockError}
            label={t<string>('password')}
            onChange={setPassword}
            onEnter={_onUnlock}
            value={password}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='unlock'
          isBusy={isBusy}
          label={t<string>('Unlock')}
          onClick={_onUnlock}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Unlock);
