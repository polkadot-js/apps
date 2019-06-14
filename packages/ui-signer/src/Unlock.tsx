// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { KeyringPair } from '@polkadot/keyring/types';

import React from 'react';
import { Password } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import translate from './translate';

type Props = I18nProps & {
  autoFocus?: boolean,
  error?: string,
  onChange: (password: string) => void,
  onEnter?: () => void,
  password: string,
  tabIndex?: number,
  value?: string | null
};

type State = {
  isError: boolean,
  isInjected: boolean,
  isLocked: boolean,
  pair: KeyringPair
};

class Unlock extends React.PureComponent<Props, State> {
  state: State = {
    isLocked: false
  } as State;

  static getDerivedStateFromProps ({ error, value }: Props): State | null {
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

  render () {
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
