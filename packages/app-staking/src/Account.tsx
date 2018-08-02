// Copyright 2017-2018 @polkadot/app-staking authors & contributors
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
import Button from '@polkadot/ui-app/Button';
import Icon from '@polkadot/ui-app/Icon';
import classes from '@polkadot/ui-app/util/classes';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import RxBalance from '@polkadot/ui-react-rx/Balance';
import RxNonce from '@polkadot/ui-react-rx/Nonce';
import decodeAddress from '@polkadot/util-keyring/address/decode';

import translate from './translate';

type Props = I18nProps & {
  address: string,
  name: string,
  nonce?: BN,
  intentionPosition: number,
  isIntending: boolean,
  isValidator: boolean,
  queueExtrinsic: QueueTx$ExtrinsicAdd
};

type State = {
  nonce: BN;
};

class Account extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      nonce: new BN(0)
    };
  }
  render () {
    const { className, isIntending, style, t } = this.props;

    return (
      <div
        className={classes('staking--Account', className)}
        style={style}
      >
        {this.renderAccount()}
        <Button
          isDisabled={isIntending}
          isPrimary
          onClick={this.stake}
          text={t('account.stake', {
            defaultValue: 'stake'
          })}
        />
        <Button
          isDisabled={!isIntending}
          isNegative
          onClick={this.unstake}
          text={t('account.unstake', {
            defaultValue: 'unstake'
          })}
        />
      </div>
    );
  }

  private renderAccount () {
    const { address, isValidator, name, t } = this.props;
    const addrShort = `${address.slice(0, 7)}…${address.slice(-7)}`;

    return (
      <div className='staking--Account-details'>
        <div>
          <Icon
            className={classes('staking--Account-validating', isValidator ? 'isValidator' : '')}
            name='certificate'
            size='large'
          />
          <IdentityIcon
            className='staking--Account-icon'
            size={32}
            value={address}
          />
          <div className='staking--Account-info'>
            <div className='staking--Account-name'>{name}</div>
            <div className='staking--Account-address'>{addrShort}</div>
          </div>
        </div>
        <RxBalance
          className='staking--Account-balance'
          label={t('account.balance', {
            defaultValue: 'balance '
          })}
          params={address}
        />
        <RxNonce
          className='staking--Account-nonce'
          onChange={this.onChangeNonce}
          params={address}
        >
          {t('account.transactions', {
            defaultValue: ' transactions'
          })}
        </RxNonce>
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

  private stake = () => {
    this.send(extrinsics.staking.public.stake, []);
  }

  private unstake = () => {
    const { intentionPosition } = this.props;

    this.send(extrinsics.staking.public.unstake, [intentionPosition]);
  }

  private onChangeNonce = (nonce: BN) => {
    this.setState({ nonce });
  }
}

export default translate(Account);
