// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps, SUIEvent } from '@polkadot/ui-app/types';
import { KeyringPair } from '@polkadot/util-keyring/types';

import React from 'react';

import Password from '@polkadot/ui-app/Password';
import keyring from '@polkadot/ui-keyring/index';

import translate from './translate';

type Props = I18nProps & {
  autoFocus?: boolean,
  error?: React.ReactNode,
  label?: string,
  onChange: (password: string) => void,
  onKeyDown?: (event: SUIEvent) => void,
  password: string,
  tabIndex?: number | string,
  value?: Uint8Array | null
};

type State = {
  error?: React.ReactNode,
  isError: boolean,
  isLocked: boolean,
  pair: KeyringPair
};

class Unlock extends React.PureComponent<Props, State> {
  state: State = {} as State;

  static getDerivedStateFromProps ({ error, value }: Props): State {
    const pair = keyring.getPair(value as Uint8Array);
    const isLocked = pair.isLocked();

    return {
      error: error,
      isError: !!error,
      isLocked,
      pair
    };
  }

  render () {
    const { autoFocus, label, onChange, onKeyDown, password, t, tabIndex } = this.props;
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
            error={error}
            isError={isError}
            label={label || t('unlock.password', {
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
