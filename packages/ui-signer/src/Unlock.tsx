// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { KeyringPair } from '@polkadot/keyring/types';

import React from 'react';
import { Password } from '@polkadot/ui-app/index';
import keyring from '@polkadot/ui-keyring';

import translate from './translate';

type Props = I18nProps & {
  autoFocus?: boolean,
  error?: string,
  label?: string,
  onChange: (password: string) => void,
  onKeyDown?: (event: React.KeyboardEvent<Element>) => void,
  password: string,
  tabIndex?: number,
  value?: string | null
};

type State = {
  isError: boolean,
  isLocked: boolean,
  pair: KeyringPair
};

class Unlock extends React.PureComponent<Props, State> {
  state: State = {} as State;

  static getDerivedStateFromProps ({ error, value }: Props): State {
    const pair = keyring.getPair(value as string);
    const isLocked = pair.isLocked();

    return {
      isError: !!error,
      isLocked,
      pair
    };
  }

  render () {
    const { autoFocus, label, onChange, onKeyDown, password, t, tabIndex } = this.props;
    const { isError, isLocked } = this.state;

    if (!isLocked) {
      return null;
    }

    return (
      <div className='ui--signer-Signer-Unlock'>
        <div className='ui--row'>
          <Password
            autoFocus={autoFocus}
            className='medium'
            isError={isError}
            label={label || t('unlock.password', {
              defaultValue: 'unlock account using the password'
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
