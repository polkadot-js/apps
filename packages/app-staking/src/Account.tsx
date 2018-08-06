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
import AddressMini from '@polkadot/ui-app/AddressMini';
import AddressSummary from '@polkadot/ui-app/AddressSummary';
import Button from '@polkadot/ui-app/Button';
import Icon from '@polkadot/ui-app/Icon';
import classes from '@polkadot/ui-app/util/classes';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withStorage from '@polkadot/ui-react-rx/with/storage';
import decodeAddress from '@polkadot/util-keyring/address/decode';
import encodeAddress from '@polkadot/util-keyring/address/encode';

import Nominating from './Nominating';
import UnnominateButton from './UnnominateButton';
import translate from './translate';

type Props = I18nProps & {
  accountIndex?: BN,
  address: string,
  name: string,
  nominating?: string,
  nominatorsFor?: Array<string>,
  intentions: Array<string>,
  isValidator: boolean,
  queueExtrinsic: QueueTx$ExtrinsicAdd,
  validators: Array<string>
};

type State = {
  isNominateOpen: boolean
};

class Account extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      isNominateOpen: false
    };
  }

  render () {
    const { address, className, intentions, isValidator, name, nominating, style } = this.props;
    const { isNominateOpen } = this.state;

    return (
      <div
        className={classes('staking--Account', className)}
        style={style}
      >
        <Nominating
          isOpen={isNominateOpen}
          onClose={this.toggleNominate}
          onNominate={this.nominate}
          intentions={intentions}
        />
        <AddressSummary
          name={name}
          value={address}
        >
          <Icon
            className={classes('staking--Account-validating', isValidator ? 'isValidator' : '')}
            name='certificate'
            size='large'
          />
          {this.renderButtons()}
          <AddressMini value={nominating} />
        </AddressSummary>
      </div>
    );
  }

  private renderButtons () {
    const { address, intentions, nominating, t } = this.props;
    const isIntending = intentions.includes(address);
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

  private send (extrinsic: SectionItem<Extrinsics>, values: Array<RawParam$Value>) {
    const { accountIndex = new BN(0), address, queueExtrinsic } = this.props;
    const publicKey = decodeAddress(address);

    queueExtrinsic({
      extrinsic,
      nonce: accountIndex,
      publicKey,
      values
    });
  }

  private toggleNominate = () => {
    this.setState(
      ({ isNominateOpen }: State) => ({
        isNominateOpen: !isNominateOpen
      })
    );
  }

  private nominate = (nominee: string) => {
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
    const { address, intentions } = this.props;

    this.send(extrinsics.staking.public.unstake, [intentions.indexOf(address)]);
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
  ),
  withStorage(
    storage.system.public.accountIndexOf,
    {
      propName: 'accountIndex',
      paramProp: 'address'
    }
  )
);
