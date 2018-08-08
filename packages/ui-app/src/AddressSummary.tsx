// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import Nonce from '@polkadot/ui-react-rx/Nonce';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';

import classes from './util/classes';
import toShortAddress from './util/toShortAddress';
import Balance from './Balance';
import CopyButton from './CopyButton';
import translate from './translate';

export type Props = I18nProps & {
  balance?: BN | Array<BN>,
  children?: React.ReactNode,
  name?: string,
  value: string,
  withBalance?: boolean,
  withNonce?: boolean
};

export type State = {
  address: string,
  isValid: boolean,
  publicKey: Uint8Array | null,
  shortValue: string
};

const DEFAULT_ADDR = '5'.padEnd(16, 'x');
const DEFAULT_SHORT = toShortAddress(DEFAULT_ADDR);

class AddressSummary extends React.PureComponent<Props, State> {
  state: State = {} as State;

  static getDerivedStateFromProps ({ value }: Props, { address, publicKey, shortValue }: State): State {
    try {
      publicKey = addressDecode(value);
      address = addressEncode(publicKey);
      shortValue = toShortAddress(address);
    } catch (error) {
      publicKey = null;
    }

    const isValid = !!publicKey && publicKey.length === 32;

    return {
      address: isValid ? address : DEFAULT_ADDR,
      isValid,
      publicKey,
      shortValue: isValid ? shortValue : DEFAULT_SHORT
    };
  }

  render () {
    const { className, style } = this.props;
    const { address, isValid } = this.state;

    return (
      <div
        className={classes('ui--AddressSummary', !isValid && 'invalid', className)}
        style={style}
      >
        <div className='ui--AddressSummary-base'>
          <IdentityIcon
            className='ui--AddressSummary-icon'
            size={96}
            value={address}
          />
          {this.renderAddress()}
          {this.renderBalance()}
          {this.renderNonce()}
        </div>
        {this.renderChildren()}
      </div>
    );
  }

  protected renderAddress () {
    const { name } = this.props;
    const { address, shortValue } = this.state;

    return (
      <div className='ui--AddressSummary-data'>
        <div className='ui--AddressSummary-name'>
          {name}
        </div>
        <div className='ui--AddressSummary-address'>
          {shortValue}
        </div>
        <CopyButton value={address} />
      </div>
    );
  }

  protected renderBalance () {
    const { isValid, publicKey } = this.state;
    const { balance, t, withBalance = true } = this.props;

    if (!withBalance || !isValid || !publicKey) {
      return null;
    }

    return (
      <Balance
        balance={balance}
        className='ui--AddressSummary-balance'
        label={t('addressSummary.balance', {
          defaultValue: 'balance '
        })}
        value={publicKey}
      />
    );
  }

  protected renderNonce () {
    const { isValid, publicKey } = this.state;
    const { t, withNonce = true } = this.props;

    if (!withNonce || !isValid) {
      return null;
    }

    return (
      <Nonce
        className='ui--AddressSummary-nonce'
        params={publicKey}
      >
        {t('addressSummary.transactions', {
          defaultValue: ' transactions'
        })}
      </Nonce>
    );
  }

  protected renderChildren () {
    const { children } = this.props;

    if (!children) {
      return null;
    }

    return (
      <div className='ui--AddressSummary-children'>
        {children}
      </div>
    );
  }
}

export {
  DEFAULT_ADDR,
  DEFAULT_SHORT,
  AddressSummary
};

export default translate(AddressSummary);
