// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$ExtrinsicAdd } from '@polkadot/ui-app/Status/types';
import { ApiProps } from '@polkadot/ui-api/types';

import React from 'react';
import { AccountId, Balance, Option, ValidatorPrefs } from '@polkadot/types';
import { AddressMini, AddressSummary, Button } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

import Bonding from './Bonding';
import Controller from './Controller';
import Staking from './Staking';
// import Nominating from './Nominating';
// import UnnominateButton from './UnnominateButton';
import translate from '../translate';

type Props = ApiProps & I18nProps & {
  accountId: string,
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  name: string,
  session_nextKeyFor?: Option<AccountId>,
  staking_bonded?: Option<AccountId>,
  staking_nominating?: Option<AccountId>,
  staking_nominatorsFor?: Array<string>,
  staking_validators?: ValidatorPrefs,
  intentions: Array<string>,
  isValidator: boolean,
  queueExtrinsic: QueueTx$ExtrinsicAdd
};

type State = {
  isBondingOpen: boolean,
  isControllerOpen: boolean,
  isStakingOpen: boolean,
  bondedId: AccountId | null,
  controllerId: AccountId | null,
  nomineeId: AccountId | null
};

class Account extends React.PureComponent<Props, State> {
  state: State = {
    isBondingOpen: false,
    isControllerOpen: false,
    isStakingOpen: false,
    bondedId: null,
    controllerId: null,
    nomineeId: null
  };

  static getDerivedStateFromProps ({ session_nextKeyFor, staking_bonded, staking_nominating }: Props): Partial<State> {
    return {
      bondedId: staking_bonded
        ? staking_bonded.unwrapOr(null)
        : null,
      controllerId: session_nextKeyFor
        ? session_nextKeyFor.unwrapOr(null)
        : null,
      nomineeId: staking_nominating
        ? staking_nominating.unwrapOr(null)
        : null
    };
  }

  render () {
    const { accountId, balanceArray, name } = this.props;

    return (
      <article className='staking--Account'>
        {this.renderBonding()}
        {this.renderController()}
        {this.renderStaking()}
        <AddressSummary
          balance={balanceArray(accountId)}
          name={name}
          value={accountId}
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

  private renderBonding () {
    const { accountId } = this.props;
    const { controllerId, isBondingOpen } = this.state;

    if (!controllerId) {
      return null;
    }

    return (
      <Bonding
        accountId={accountId}
        controllerId={controllerId}
        isOpen={isBondingOpen}
        onClose={this.toggleBonding}
      />
    );
  }

  private renderController () {
    const { accountId } = this.props;
    const { controllerId, isControllerOpen } = this.state;

    return (
      <Controller
        accountId={accountId}
        controllerId={controllerId}
        isOpen={isControllerOpen}
        onClose={this.toggleController}
      />
    );
  }

  private renderStaking () {
    const { accountId, staking_validators } = this.props;
    const { isStakingOpen } = this.state;

    if (!staking_validators || !isStakingOpen) {
      return null;
    }

    return (
      <Staking
        accountId={accountId}
        isOpen
        onClose={this.toggleStaking}
        preferences={staking_validators}
      />
    );
  }

  private renderNominee () {
    const { balanceArray } = this.props;
    const { nomineeId } = this.state;

    if (!nomineeId) {
      return null;
    }

    return (
      <AddressMini
        balance={balanceArray(nomineeId)}
        value={nomineeId}
        withBalance
      />
    );
  }

  private renderNominators () {
    const { staking_nominatorsFor } = this.props;

    if (!staking_nominatorsFor) {
      return null;
    }

    return (
      <div className='ui--Nominators'>
        {staking_nominatorsFor.map((nominator) => (
          <AddressMini
            isPadded={false}
            key={nominator}
            value={nominator}
            withBalance
          />
        ))}
      </div>
    );
  }

  // private renderNominating () {
  //   const { intentions } = this.props;
  //   const { isNominateOpen } = this.state;

  //   return (
  //     <Nominating
  //       isOpen={isNominateOpen}
  //       onClose={this.toggleNominate}
  //       onNominate={this.nominate}
  //       intentions={intentions}
  //     />
  //   );
  // }

  // private renderPrefs () {
  //   const { accountId, staking_validatorPreferences } = this.props;
  //   const { isPrefsOpen } = this.state;

  //   return (
  //     <Preferences
  //       accountId={accountId}
  //       isOpen={isPrefsOpen}
  //       onClose={this.togglePrefs}
  //       onSetPrefs={this.setPrefs}
  //       validatorPreferences={staking_validatorPreferences}
  //     />
  //   );
  // }

  private renderButtons () {
    const { t } = this.props;
    const { bondedId, controllerId } = this.state;
    const buttons = [
      <Button
        isPrimary
        key='controller'
        onClick={this.toggleController}
        label={t('Controller')}
      />
    ];

    // only display bonmding if we already have a controller
    if (controllerId) {
      buttons.push(<Button.Or key='bond.or' />);
      buttons.push(
        <Button
          isPrimary
          key='bond'
          onClick={this.toggleBonding}
          label={t('Bond')}
        />
      );
    }

    // only stake/nominate if we already have bonded
    if (bondedId) {
      buttons.push(<Button.Or key='stake.or' />);
      buttons.push(
        <Button
          isPrimary
          key='stake'
          onClick={this.toggleStaking}
          label={t('Stake')}
        />
      );
    }

    return (
      <Button.Group>
        {buttons}
      </Button.Group>
    );

  }

  // private nominate = (nominee: string) => {
  //   const { api } = this.props;

  //   this.send(api.tx.staking.nominate(nominee));

  //   this.toggleNominate();
  // }

  // private unnominate = (index: number) => {
  //   const { api } = this.props;

  //   this.send(api.tx.staking.unnominate(index));
  // }

  // private setPrefs = (prefs: ValidatorPrefs) => {
  //   const { api } = this.props;

  //   this.send(api.tx.staking.registerPreferences(this.getIntentionIndex(), prefs));

  //   this.togglePrefs();
  // }

  // private stake = () => {
  //   const { api } = this.props;

  //   this.send(api.tx.staking.stake());
  // }

  // private unstake = () => {
  //   const { api } = this.props;

  //   this.send(api.tx.staking.unstake(this.getIntentionIndex()));
  // }

  // private getIntentionIndex (): number {
  //   const { accountId, intentions } = this.props;

  //   return intentions.indexOf(accountId);
  // }

  private toggleBonding = () => {
    this.setState(({ isBondingOpen }) => ({
      isBondingOpen: !isBondingOpen
    }));
  }

  private toggleController = () => {
    this.setState(({ isControllerOpen }) => ({
      isControllerOpen: !isControllerOpen
    }));
  }

  private toggleStaking = () => {
    this.setState(({ isStakingOpen }) => ({
      isStakingOpen: !isStakingOpen
    }));
  }

  // private toggleNominate = () => {
  //   this.setState(({ isNominateOpen }: State) => ({
  //     isNominateOpen: !isNominateOpen
  //   }));
  // }

  // private togglePrefs = () => {
  //   this.setState(({ isPrefsOpen }: State) => ({
  //     isPrefsOpen: !isPrefsOpen
  //   }));
  // }
}

export default translate(
  withCalls<Props>(
    ['query.session.nextKeyFor', { paramName: 'accountId' }],
    ['query.staking.bonded', { paramName: 'accountId' }],
    ['query.staking.nominatorsFor', { paramName: 'accountId' }],
    ['query.staking.nominating', { paramName: 'accountId' }],
    ['query.staking.validators', { paramName: 'accountId' }]
  )(Account)
);
