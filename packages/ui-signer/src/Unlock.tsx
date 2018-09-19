// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { KeyringPair } from '@polkadot/util-keyring/types';

import React from 'react';

import Password from '@polkadot/ui-app/Password';
import keyring from '@polkadot/ui-keyring/index';

import translate from './translate';

let isLocked: boolean | undefined;
let pair: KeyringPair | undefined;

type Props = I18nProps & {
  autoFocus?: boolean,
  error?: React.ReactNode,
  onChange: (password: string) => void,
  onKeyDown?: (event: React.KeyboardEvent<Element>) => void,
  password: string,
  tabIndex?: number,
  value?: Uint8Array | null
};

type State = {
  error?: React.ReactNode,
  isError: boolean,
  isLocked?: boolean,
  pair?: KeyringPair
};

class Unlock extends React.PureComponent<Props, State> {
  state: State = {} as State;

  static getDerivedStateFromProps ({ error, value }: Props): State {
    try {
      pair = keyring.getPair(value as Uint8Array);
      isLocked = pair.isLocked();
    } catch (error) {
      console.error('Unable to retrieve keypair', error);
    }

    return {
      error,
      isError: !!error,
      isLocked,
      pair
    };
  }

  render () {
    const { autoFocus, onChange, onKeyDown, password, t, tabIndex } = this.props;
    const { error, isError, isLocked, pair } = this.state;

    if (pair && !isLocked) {
      pair.lock();
    }

    return (
      <div className='ui--signer-Signer-Unlock'>
        <div className='ui--row'>
          <Password
            autoFocus={autoFocus}
            className='medium'
            isError={isError}
            error={error}
            label={t('unlock.password', {
              defaultValue: 'unlock account using'
            })}
            onChange={onChange}
            onKeyDown={onKeyDown}
            tabIndex={tabIndex}
            value={password}
          />
        </div>
      </div>
    );
  }
}

export default translate(Unlock);
