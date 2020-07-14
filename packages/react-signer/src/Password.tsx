// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal, Password } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from './translate';

interface Props {
  address: string;
  className?: string;
  error?: string;
  onChange: (password: string) => void;
  onEnter?: () => void;
  password: string;
  tabIndex?: number;
}

function getPair (address?: string | null): KeyringPair | null {
  try {
    return keyring.getPair(address as string);
  } catch (error) {
    return null;
  }
}

function Unlock ({ address, className, error, onChange, onEnter, tabIndex }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [pair, setPair] = useState<KeyringPair | null>(null);
  const [password, setPassword] = useState('');

  useEffect((): void => {
    setPair(getPair(address));
  }, [address]);

  useEffect((): void => {
    onChange(password);
  }, [onChange, password]);

  if (!pair || !pair.isLocked || pair.meta.isInjected) {
    return null;
  }

  return (
    <Modal.Columns className={className}>
      <Modal.Column>
        <Password
          autoFocus
          isError={!!error}
          label={t('unlock account with password')}
          labelExtra={error && <div className='errorLabel'>{t('wrong password supplied')}</div>}
          onChange={setPassword}
          onEnter={onEnter}
          tabIndex={tabIndex}
          value={password}
        />
      </Modal.Column>
      <Modal.Column>
        <p>{t('Unlock the sending account to allow signing of this transaction.')}</p>
      </Modal.Column>
    </Modal.Columns>
  );
}

export default React.memo(styled(Unlock)`
  .errorLabel {
    margin-right: 2rem;
    color: #9f3a38 !important;
  }
`);
