// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Password } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from './translate';

interface Props {
  autoFocus?: boolean;
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

function Unlock ({ autoFocus, className, error, onChange, onEnter, password, tabIndex, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [pair] = useState<KeyringPair | null>(getPair(value));

  if (!pair || !(pair.isLocked) || pair.meta.isInjected) {
    return null;
  }

  return (
    <div className={`ui--signer-Signer-Unlock ${className}`}>
      <Password
        autoFocus={autoFocus}
        isError={!!error}
        isFull
        label={t('unlock account with password')}
        labelExtra={error && <div className='errorLabel'>{t('wrong password supplied')}</div>}
        onChange={onChange}
        onEnter={onEnter}
        tabIndex={tabIndex}
        value={password}
      />
    </div>
  );
}

export default styled(Unlock)`
  .errorLabel {
    margin-right: 2rem;
    color: #9f3a38 !important;
  }
`;
