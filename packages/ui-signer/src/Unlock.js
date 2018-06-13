// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';
import type { KeyringPair } from '@polkadot/util-keyring/types';

import React from 'react';

import Password from '@polkadot/ui-app/Password';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring';

import translate from './translate';

type Props = I18nProps & {
  error?: string,
  onChange: (password: string) => void,
  password: string,
  value: Uint8Array,
}

type State = {
  isError: boolean,
  isLocked: boolean,
  pair: KeyringPair
}

class Unlock extends React.PureComponent<Props, State> {
  state: State = ({}: $Shape<State>);

  static getDerivedStateFromProps ({ error, password, value }: Props): State {
    const pair = keyring.getPair(value);
    const isLocked = !pair.hasSecretKey();

    return {
      isError: !!error,
      isLocked,
      pair
    };
  }

  render (): React$Node {
    const { className, onChange, password, style, t } = this.props;
    const { isError, isLocked } = this.state;

    if (!isLocked) {
      return null;
    }

    return (
      <div
        className={classes('ui--signer-Signer-Unlock', className)}
        style={style}
      >
        <div className='ui--row'>
          <Password
            className='medium'
            isError={isError}
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
