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

import UnnominateButton from './UnnominateButton';
import translate from './translate';

type Props = I18nProps & {
  address: string,
  name: string,
  nonce?: BN,
  nominating?: string,
  nominatorsFor?: Array<string>,
  intentionPosition: number,
  isIntending: boolean,
  isValidator: boolean,
  queueExtrinsic: QueueTx$ExtrinsicAdd,
  validators: Array<string>
};

type State = {
  isInNominate: boolean,
  isNomineeValid: boolean,
  nominee: string,
  nonce: BN
};

class Account extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      isInNominate: false,
      isNomineeValid: false,
      nonce: new BN(0),
      nominee: ''
    };
  }

  render () {
    const { className, style } = this.props;

    return (
      <div
        className={classes('staking--Account', className)}
        style={style}
      >
        {this.renderAccount()}
        {this.renderButtons()}
        {this.renderNominate()}
      </div>
    );
  }

  private renderAccount () {
    const { address, isValidator, name, t } = this.props;
    // TODO: Still now sure what the best layout is, so just keeping the shortened around
    // const addrShort = `${address.slice(0, 7)}…${address.slice(-7)}`;

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
            <div className='staking--Account-address'>{address}</div>
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

  private renderButtons () {
    const { isInNominate } = this.state;

    if (isInNominate) {
      return null;
    }

    const { address, isIntending, nominating, t } = this.props;
    const isNominating = !!nominating;
    const canStake = !isIntending && !isNominating;

    if (canStake) {
      return (
        <div className='staking--Account-buttons'>
          <Button.Group>
            <Button
              isPrimary
              onClick={this.stake}
              text={t('account.stake', {
                defaultValue: 'stake'
              })}
            />
            <Button.Or />
            <Button
              isPrimary
              onClick={this.toggleNominate}
              text={t('account.nominate', {
                defaultValue: 'nominate'
              })}
            />
          </Button.Group>
        </div>
      );
    }

    if (isNominating) {
      return (
        <div className='staking--Account-buttons'>
          <Button.Group>
            <UnnominateButton
              address={address || ''}
              nominating={nominating || ''}
              onClick={this.unnominate}
            />
          </Button.Group>
        </div>
      );
    }

    return (
      <div className='staking--Account-buttons'>
        <Button.Group>
          <Button
            isNegative
            onClick={this.unstake}
            text={t('account.unstake', {
              defaultValue: 'unstake'
            })}
          />
        </Button.Group>
      </div>
    );
  }

  private renderNominate () {
    const { isInNominate, isNomineeValid, nominee } = this.state;

    if (!isInNominate) {
      return null;
    }

    const { t } = this.props;

    return (
      <div className='staking--Account-nominate'>
        <div className='ui--row'>
          <Input
            className='medium'
            isError={!isNomineeValid}
            label={t('nominator.address', {
              defaultValue: 'nominate the following validator'
            })}
            onChange={this.onChangeNominee}
            value={nominee}
          />
        </div>
        <div className='ui--row'>
          <div className='medium'>
          <Button.Group>
            <Button
              onClick={this.toggleNominate}
              text={t('nominators.discard', {
                defaultValue: 'Cancel'
              })}
            />
            <Button
              isDisabled={!isNomineeValid}
              isPrimary
              onClick={this.nominate}
              text={t('nominator.nominate', {
                defaultValue: 'nominate'
              })}
            />
          </Button.Group>
          </div>
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

  private toggleNominate = () => {
    this.setState(
      ({ isInNominate }: State) => ({
        isInNominate: !isInNominate
      })
    );
  }

  private onChangeNominee = (nominee: string) => {
    const { validators } = this.props;

    this.setState({
      isNomineeValid: validators.includes(nominee),
      nominee
    });
  }

  private nominate = () => {
    const { nominee } = this.state;

    this.send(extrinsics.staking.public.nominate, [nominee]);

    this.toggleNominate();
  }

  private unnominate = (index: number) => {
    this.send(extrinsics.staking.public.unnominate, [index]);
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

export default withMulti(
  Account,
  translate,
  withStorage(
    storage.staking.public.nominatorsFor,
    {
      propName: 'nominatorsFor',
      paramProp: 'address',
      transform: (publicKeys: Array<Uint8Array>) =>
        publicKeys.map(encodeAddress)
    }
  ),
  withStorage(
    storage.staking.public.nominating,
    {
      propName: 'nominating',
      paramProp: 'address',
      transform: encodeAddress
    }
  )
);
