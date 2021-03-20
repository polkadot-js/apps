// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from '@polkadot/keyring/types';

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Modal, Password, Toggle } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';

import { useTranslation } from './translate';
import { UNLOCK_MINS } from './util';

interface Props {
  address: string;
  className?: string;
  error?: string;
  onChange: (password: string, isUnlockCached: boolean) => void;
  onEnter?: () => void;
  password: string;
  tabIndex?: number;
}

function getPair (address: string): KeyringPair | null {
  try {
    return keyring.getPair(address);
  } catch (error) {
    return null;
  }
}

function Unlock ({ address, className, error, onChange, onEnter, tabIndex }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [isUnlockCached, setIsUnlockCached] = useState(false);

  const pair = useMemo(
    () => getPair(address),
    [address]
  );

  useEffect((): void => {
    onChange(password, isUnlockCached);
  }, [onChange, isUnlockCached, password]);

  if (!pair || !pair.isLocked || pair.meta.isInjected) {
    return null;
  }

  return (
    <Modal.Columns
      className={className}
      hint={t('Unlock the sending account to allow signing of this transaction.')}
    >
      <Password
        autoFocus
        isError={!!error}
        label={t<string>('unlock account with password')}
        onChange={setPassword}
        onEnter={onEnter}
        tabIndex={tabIndex}
        value={password}
      >
        <Toggle
          isOverlay
          label={t<string>('unlock for {{expiry}} min', { replace: { expiry: UNLOCK_MINS } })}
          onChange={setIsUnlockCached}
          value={isUnlockCached}
        />
      </Password>
    </Modal.Columns>
  );
}

export default React.memo(styled(Unlock)`
  .errorLabel {
    margin-right: 1rem;
    color: #9f3a38 !important;
  }

  .ui--Toggle {
    bottom: 1.1rem;
  }
`);
