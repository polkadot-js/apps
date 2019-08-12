// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { KeyringPair } from '@polkadot/keyring/types';

import React from 'react';
import { Password } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import translate from './translate';

interface Props extends I18nProps {
  autoFocus?: boolean;
  error?: string;
  onChange: (password: string) => void;
  onEnter?: () => void;
  password: string;
  tabIndex?: number;
  value?: string | null;
}

interface State {
  isError: boolean;
  isInjected?: boolean;
  isLocked: boolean;
  pair?: KeyringPair;
}

class Unlock extends React.PureComponent<Props, State> {
  public state: State = {
    isError: false,
    isLocked: false
  };

  public static getDerivedStateFromProps ({ error, value }: Props): State | null {
    const pair = keyring.getPair(value as string);

    if (!pair) {
      return null;
    }

    const { isLocked, meta: { isInjected = false } } = pair;

    return {
      isError: !!error,
      isInjected,
      isLocked,
      pair
    };
  }

  public render (): React.ReactNode {
    const { autoFocus, onChange, onEnter, password, t, tabIndex } = this.props;
    const { isError, isInjected, isLocked } = this.state;

    if (isInjected || !isLocked) {
      return null;
    }

    return (
      <div className='ui--signer-Signer-Unlock'>
        <Password
          autoFocus={autoFocus}
          isError={isError}
          label={t('unlock account with password')}
          onChange={onChange}
          onEnter={onEnter}
          tabIndex={tabIndex}
          value={password}
        />
      </div>
    );
  }
}

export default translate(Unlock);
