// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { KeyringPair } from '@polkadot/util-keyring/types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import Input from 'semantic-ui-react/dist/es/elements/Input';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import keyring from '@polkadot/ui-keyring/src';

import translate from '../translate';

type Props = I18nProps & {
  error?: string,
  onChange: (password: string) => void,
  publicKey: Uint8Array,
  password: string,
  value: Uint8Array,
}

type State = {
  fieldName: string,
  isError: boolean,
  isLocked: boolean,
  isVisible: boolean,
  pair: KeyringPair
}

class Unlock extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = ({
      isVisible: false
    }: $Shape<State>);
  }

  static getDerivedStateFromProps ({ error, password, value }: Props, { isVisible }: State): $Shape<State> {
    const pair = keyring.getPair(value);
    const isLocked = !pair.hasSecretKey();

    return {
      fieldName: `pass_${Date.now()}`,
      isError: !!error,
      isLocked,
      isVisible: password.length === 0
        ? false
        : isVisible,
      pair
    };
  }

  render (): React$Node {
    const { className, password, style, t } = this.props;
    const { fieldName, isError, isLocked, isVisible } = this.state;

    if (!isLocked) {
      return null;
    }

    return (
      <div
        className={['extrinsics--Signer-Unlock', className].join(' ')}
        style={style}
      >
        <div className='expanded ui--form'>
          <div className='medium'>
            <Label>{t('unlock.password', {
              defaultValue: 'unlock account using'
            })}</Label>
            <Input
              action
              error={isError}
              name={fieldName}
              onChange={this.onChange}
              type={isVisible ? 'text' : 'password'}
              value={password}
            >
              <input />
              <Button
                icon='eye'
                primary
                onClick={this.togglePassword}
              />
            </Input>
          </div>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line no-unused-vars
  onChange = (event: SyntheticEvent<*>, { value }): void => {
    this.props.onChange(value);
  }

  togglePassword = (): void => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  }
}

export default translate(Unlock);
