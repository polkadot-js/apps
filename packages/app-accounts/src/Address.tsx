// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import store from 'store';

import CopyButton from '@polkadot/ui-app/CopyButton';
import showUploadButton from './util/showUploadButton';
import showUploadAndDownloadButtons from './util/showUploadAndDownloadButtons';
import classes from '@polkadot/ui-app/util/classes';
import isUndefined from '@polkadot/util/is/undefined';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import Balance from '@polkadot/ui-react-rx/Balance';
import Nonce from '@polkadot/ui-react-rx/Nonce';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';
import { accountKey } from '@polkadot/ui-keyring/defaults';

type Props = BareProps & {
  value: string;
  hideAllFileIcons?: boolean;
};

type State = {
  address: string,
  hideAllFileIcons: boolean | false,
  isValid: boolean,
  publicKey: Uint8Array | null,
  shortValue: string
};

const DEFAULT_ADDR = '5'.padEnd(16, 'x');
const DEFAULT_SHORT = `${DEFAULT_ADDR.slice(0, 7)}…${DEFAULT_ADDR.slice(-7)}`;

export default class Address extends React.PureComponent<Props, State> {
  state: State = {} as State;

  static getDerivedStateFromProps ({ value, hideAllFileIcons }: Props, { address, publicKey, shortValue }: State): State {
    try {
      hideAllFileIcons = hideAllFileIcons;
      publicKey = addressDecode(value);
      address = addressEncode(publicKey);
      shortValue = `${address.slice(0, 7)}…${address.slice(-7)}`;
    } catch (error) {
      publicKey = null;
    }

    const isValid = !!publicKey && publicKey.length === 32;

    return {
      address: isValid ? address : DEFAULT_ADDR,
      hideAllFileIcons,
      isValid,
      publicKey,
      shortValue: isValid ? shortValue : DEFAULT_SHORT
    };
  }

  render () {
    const { className, style } = this.props;
    const { address, hideAllFileIcons, isValid, shortValue } = this.state;

    const isAccountAlreadySaved = () => {
      const localStorageAccountKey = accountKey(address);

      try {
        const localStorageAccountValue = store.get(localStorageAccountKey);

        return isUndefined(localStorageAccountValue) ? false : true;
      } catch (e) {
        console.error('Error finding account from local storage: ', e);
      }

      return false;
    };

    return (
      <div
        className={classes('accounts--Address', !isValid && 'invalid', className)}
        style={style}
      >
        <IdentityIcon
          className='accounts--Address-icon'
          size={96}
          value={address}
        />
        <div className='accounts--Address-data'>
          <div className='accounts--Address-address'>
            {shortValue}
          </div>
          <CopyButton value={address} />
          {
            hideAllFileIcons ? (
              null
            ) : (
              isValid && isAccountAlreadySaved() ? showUploadAndDownloadButtons(address) : showUploadButton()
            )
          }
        </div>
        {this.renderBalance()}
      </div>
    );
  }

  renderBalance () {
    const { isValid, publicKey } = this.state;

    if (!isValid) {
      return null;
    }

    return [
      <Balance
        className='accounts--Address-balance'
        key='balance'
        label='balance '
        params={publicKey}
      />,
      <Nonce
        className='accounts--Address-nonce'
        key='nonce'
        params={publicKey}
      >
        {' transactions'}
      </Nonce>
    ];
  }
}
