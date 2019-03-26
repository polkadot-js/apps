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
// import Nominating from './Nominating';
// import Preferences from './Preferences';
// import UnnominateButton from './UnnominateButton';
import translate from '../translate';

type Props = ApiProps & I18nProps & {
  accountId: string,
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  name: string,
  session_nextKeyFor?: Option<AccountId>,
  staking_nominating?: Option<AccountId>,
  staking_nominatorsFor?: Array<string>,
  staking_validatorPreferences?: ValidatorPrefs,
  intentions: Array<string>,
  isValidator: boolean,
  queueExtrinsic: QueueTx$ExtrinsicAdd
};

type State = {
  isBondingOpen: boolean,
  isControllerOpen: boolean,
  nominee: AccountId | null
};

class Account extends React.PureComponent<Props, State> {
  state: State = {
    isBondingOpen: false,
    isControllerOpen: false,
    nominee: null
  };

  static getDerivedStateFromProps ({ staking_nominating }: Props): Partial<State> {
    return {
      nominee: staking_nominating
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
    const { accountId, session_nextKeyFor } = this.props;
    const { isBondingOpen } = this.state;

    if (!session_nextKeyFor || session_nextKeyFor.isNone) {
      return null;
    }

    return (
      <Bonding
        accountId={accountId}
        controllerId={session_nextKeyFor.unwrap()}
        isOpen={isBondingOpen}
        onClose={this.toggleBonding}
      />
    );
  }

  private renderController () {
    const { accountId, session_nextKeyFor } = this.props;
    const { isControllerOpen } = this.state;
    const controllerId = session_nextKeyFor
      ? session_nextKeyFor.unwrapOr(null)
      : null;

    return (
      <Controller
        accountId={accountId}
        controllerId={controllerId}
        isOpen={isControllerOpen}
        onClose={this.toggleController}
      />
    );
  }

  private renderNominee () {
    const { balanceArray } = this.props;
    const { nominee } = this.state;

    if (!nominee) {
      return null;
    }

    return (
      <AddressMini
        balance={balanceArray(nominee)}
        value={nominee}
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
    const { session_nextKeyFor, t } = this.props;
    const buttons = [
      <Button
        isPrimary
        key='controller'
        onClick={this.toggleController}
        label={t('Controller')}
      />
    ];

    if (session_nextKeyFor && session_nextKeyFor.isSome) {
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
    ['query.staking.nominatorsFor', { paramName: 'accountId' }],
    ['query.staking.nominating', { paramName: 'accountId' }],
    ['query.staking.validatorPreferences', { paramName: 'accountId' }]
  )(Account)
);
