// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps, UnlockI18n } from '@polkadot/ui-app/types';
import { KeyringPair } from '@polkadot/util-keyring/types';

import React from 'react';

import Password from '@polkadot/ui-app/Password';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';

import translate from './translate';

type Props = I18nProps & {
  error?: UnlockI18n | null,
  onChange: (password: string) => void,
  password: string,
  passwordWidth?: string,
  value?: Uint8Array | null
};

type State = {
  isError: boolean,
  isLocked: boolean,
  pair: KeyringPair
};

class Unlock extends React.PureComponent<Props, State> {
  state: State = {} as State;

  static getDerivedStateFromProps ({ error, password, value }: Props): State {
    const pair = keyring.getPair(value as Uint8Array);
    const isLocked = pair.isLocked();

    return {
      isError: !!error,
      error: error,
      isLocked,
      pair
    };
  }

  render () {
    const { className, onChange, password, passwordWidth, style, t } = this.props;
    const { isError, isLocked, error } = this.state;

    if (!isLocked) {
      // FIXME - console.log('Remove secret key from keyring memory');
      // pair.lock();
    }

    return (
      <div
        className={classes('ui--signer-Signer-Unlock', className)}
        style={style}
      >
        <div className='ui--row'>
          <Password
            className={passwordWidth ? passwordWidth : 'medium'}
            isError={isError}
            error={error}
            label={t('unlock.password', {
              defaultValue: 'unlock account using'
            })}
            onChange={onChange}
            value={password}
          />
        </div>
      </div>
    );
  }
}

export default translate(Unlock);
