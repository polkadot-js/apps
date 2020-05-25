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
  className?: string;
  error?: string;
  onChange: (password: string) => void;
  onEnter?: () => void;
  password: string;
  tabIndex?: number;
  value?: string | null;
}

function getPair (address?: string | null): KeyringPair | null {
  try {
    return keyring.getPair(address as string);
  } catch (error) {
    return null;
  }
}

function Unlock ({ className = '', error, onChange, onEnter, password, tabIndex, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [pair, setPair] = useState<KeyringPair | null>(null);

  useEffect((): void => {
    setPair(getPair(value));
  }, [value]);

  if (!pair || !(pair.isLocked) || pair.meta.isInjected) {
    return null;
  }

  return (
    <div className={`ui--signer-Signer-Unlock ${className}`}>
      <Modal.Columns>
        <Modal.Column>
          <Password
            autoFocus
            isError={!!error}
            label={t<string>('unlock account with password')}
            labelExtra={error && <div className='errorLabel'>{t<string>('wrong password supplied')}</div>}
            onChange={onChange}
            onEnter={onEnter}
            tabIndex={tabIndex}
            value={password}
          />
        </Modal.Column>
        <Modal.Column>
          <p>{t<string>('Unlock the sending account to allow signing of this transaction.')}</p>
        </Modal.Column>
      </Modal.Columns>
    </div>
  );
}

export default React.memo(styled(Unlock)`
  .errorLabel {
    margin-right: 2rem;
    color: #9f3a38 !important;
  }
`);
