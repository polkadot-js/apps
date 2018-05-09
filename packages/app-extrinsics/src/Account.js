// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import Balance from '@polkadot/ui-react-rx/Balance';
import InputAddress from '@polkadot/ui-react-app/src/InputAddress';

import translate from './translate';

type Props = I18nProps & {
  defaultValue?: Uint8Array,
  isError?: boolean,
  isInput?: boolean,
  label: string,
  onChange: (publicKey: Uint8Array) => void
};

type State = {
  publicKey?: Uint8Array
};

class Account extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      publicKey: props.defaultValue
    };
  }

  render (): React$Node {
    const { className, defaultValue, isError, isInput, label, style, t } = this.props;
    const { publicKey } = this.state;

    return (
      <div
        className={['extrinsics--Account', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='large'>
          <InputAddress
            defaultValue={defaultValue}
            isError={isError}
            isInput={isInput}
            label={label}
            onChange={this.onChange}
            placeholder='0x...'
          />
        </div>
        <div className='small'>
          <Label>
            {t('account.balance', {
              defaultValue: 'with an available balance of'
            })}
          </Label>
          <Balance
            className='ui disabled dropdown selection'
            params={publicKey}
          />
        </div>
      </div>
    );
  }

  onChange = (publicKey: Uint8Array): void => {
    const { onChange } = this.props;

    this.setState({ publicKey }, () =>
      onChange(publicKey)
    );
  };
}

export default translate(Account);
