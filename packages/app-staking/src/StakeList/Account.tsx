// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { Extrinsics } from '@polkadot/extrinsics/types';
import { SectionItem } from '@polkadot/params/types';
import { RawParam$Value } from '@polkadot/ui-app/Params/types';
import { QueueTx$ExtrinsicAdd } from '@polkadot/ui-signer/types';
import { RxBalanceMap } from '@polkadot/ui-react-rx/ApiObservable/types';

import BN from 'bn.js';
import React from 'react';
import extrinsics from '@polkadot/extrinsics';
import AddressMini from '@polkadot/ui-app/AddressMini';
import AddressSummary from '@polkadot/ui-app/AddressSummary';
import Button from '@polkadot/ui-app/Button';
import Icon from '@polkadot/ui-app/Icon';
import classes from '@polkadot/ui-app/util/classes';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withObservable from '@polkadot/ui-react-rx/with/observable';

import Nominating from './Nominating';
import UnnominateButton from './UnnominateButton';
import translate from '../translate';

type Props = I18nProps & {
  systemAccountIndexOf?: BN,
  ss58: string,
  balances: RxBalanceMap,
  name: string,
  stakingNominating?: string,
  stakingNominatorsFor?: Array<string>,
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
    const { ss58, intentions, isValidator, name } = this.props;
    const { isNominateOpen } = this.state;

    return (
      <article className='staking--Account'>
        <Icon
          className={classes('staking--Account-validating', isValidator ? 'isValidator' : '')}
          name='certificate'
          size='large'
        />
        <Nominating
          isOpen={isNominateOpen}
          onClose={this.toggleNominate}
          onNominate={this.nominate}
          intentions={intentions}
        />
        <AddressSummary
          balance={this.balanceArray(ss58)}
          name={name}
          value={ss58}
          identIconSize={96}
        >
          <div className='staking--Account-expand'>
            {this.renderButtons()}
            {this.renderNominee()}
            {this.renderNominators()}
          </div>
        </AddressSummary>
      </article>
    );
  }

  private balanceArray (ss58: string): Array<BN> | undefined {
    const { balances } = this.props;

    return balances[ss58]
      ? [balances[ss58].stakingBalance, balances[ss58].nominatedBalance]
      : undefined;
  }

  private renderNominee () {
    const { stakingNominating } = this.props;

    if (!stakingNominating) {
      return null;
    }

    return (
      <AddressMini
        balance={this.balanceArray(stakingNominating)}
        value={stakingNominating}
        withBalance
      />
    );
  }

  private renderNominators () {
    const { stakingNominatorsFor } = this.props;

    if (!stakingNominatorsFor) {
      return null;
    }

    return stakingNominatorsFor.map((nominator) => (
      <AddressMini
        key={nominator}
        value={nominator}
        withBalance
      />
    ));
  }

  private renderButtons () {
    const { ss58, intentions, stakingNominating, t } = this.props;
    const isIntending = intentions.includes(ss58);
    const isNominating = !!stakingNominating;
    const canStake = !isIntending && !isNominating;

    if (canStake) {
      return (
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
      );
    }

    if (isNominating) {
      return (
        <Button.Group>
          <UnnominateButton
            address={ss58 || ''}
            nominating={stakingNominating || ''}
            onClick={this.unnominate}
          />
        </Button.Group>
      );
    }

    return (
      <Button.Group>
        <Button
          isNegative
          onClick={this.unstake}
          text={t('account.unstake', {
            defaultValue: 'unstake'
          })}
        />
      </Button.Group>
    );
  }

  private send (extrinsic: SectionItem<Extrinsics>, values: Array<RawParam$Value>) {
    const { systemAccountIndexOf, ss58, queueExtrinsic } = this.props;

    queueExtrinsic({
      extrinsic,
      nonce: systemAccountIndexOf || new BN(0),
      ss58,
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
    const { ss58, intentions } = this.props;

    this.send(extrinsics.staking.public.unstake, [intentions.indexOf(ss58)]);
  }
}

export default withMulti(
  Account,
  translate,
  withObservable('stakingNominatorsFor', { paramProp: 'ss58' }),
  withObservable('stakingNominating', { paramProp: 'ss58' }),
  withObservable('systemAccountIndexOf', { paramProp: 'ss58' })
);
