// Copyright 2017-2018 @polkadot/app-validator authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { Extrinsics } from '@polkadot/extrinsics/types';
import { SectionItem } from '@polkadot/params/types';
import { RawParam$Value } from '@polkadot/ui-app/Params/types';
import { QueueTx$ExtrinsicAdd } from '@polkadot/ui-signer/types';

import BN from 'bn.js';
import React from 'react';
import extrinsics from '@polkadot/extrinsics';
import storage from '@polkadot/storage';
import Button from '@polkadot/ui-app/Button';
import Icon from '@polkadot/ui-app/Icon';
import Input from '@polkadot/ui-app/Input';
import classes from '@polkadot/ui-app/util/classes';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import RxBalance from '@polkadot/ui-react-rx/Balance';
import RxNonce from '@polkadot/ui-react-rx/Nonce';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withStorage from '@polkadot/ui-react-rx/with/storage';
import decodeAddress from '@polkadot/util-keyring/address/decode';
import encodeAddress from '@polkadot/util-keyring/address/encode';
import keyring from '@polkadot/ui-keyring/index';

import translate from '../translate';

type Props = I18nProps & {
  address: string,
  name: string,
  nonce?: BN,
  queueExtrinsic: QueueTx$ExtrinsicAdd
};

type State = {
  nonce: BN
};

class Account extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      nonce: new BN(0)
    };
  }

  render () {
    const { className, style } = this.props;

    return (
      <div
        className={classes('validator--Account', className)}
        style={style}
      >
        {this.renderAccount()}
      </div>
    );
  }

  private renderAccount () {
    const { address, name, t } = this.props;
    const isMine = false; // keyring.getAccounts().includes(address)

    return (
      <div className='validator--Account-details'>

          {/*<IdentityIcon
            className='validator--Account-icon'
            size={32}
            value={address}
          />*/}
          <div className='validator--Account-info'>
            <div className='validator--Account-name'>{name}</div>
            <div className={classes('validator--Account-address', isMine ? 'isMine' : '')} >{address}</div>
          </div>
          <div className='validator--Account-info'>
            <RxNonce
              className='validator--Account-nonce'
              onChange={this.onChangeNonce}
              params={address}
            >
              {t('account.transactions', {
                defaultValue: ' transactions'
              })}
            </RxNonce>
            <RxBalance
              className='validator--Account-balance'
              label={t('', {
                defaultValue: 'balance '
              })}
              params={address}
            />
          </div>
      </div>
    );
  }

  private send (extrinsic: SectionItem<Extrinsics>, values: Array<RawParam$Value>) {
    const { address, queueExtrinsic } = this.props;
    const { nonce } = this.state;
    const publicKey = decodeAddress(address);

    queueExtrinsic({
      extrinsic,
      nonce,
      publicKey,
      values
    });
  }

  private onChangeNonce = (nonce: BN) => {
    this.setState({ nonce });
  }
}

export default withMulti(
  Account,
  translate
);
