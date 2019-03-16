// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$ExtrinsicAdd } from '@polkadot/ui-app/Status/types';
import { ApiProps } from '@polkadot/ui-api/types';

import React from 'react';
import { AccountId, Balance, Option, ValidatorPrefs } from '@polkadot/types';
import { AddressMini, AddressSummary, Button } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

import Nominating from './Nominating';
import Preferences from './Preferences';
import UnnominateButton from './UnnominateButton';
import translate from '../translate';

type Props = ApiProps & I18nProps & {
  accountId: string,
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  name: string,
  staking_nominating?: Option<AccountId>,
  staking_nominatorsFor?: Array<string>,
  staking_validatorPreferences?: ValidatorPrefs,
  intentions: Array<string>,
  isValidator: boolean,
  queueExtrinsic: QueueTx$ExtrinsicAdd
};

type State = {
  isNominateOpen: boolean,
  isNominating: boolean,
  isPrefsOpen: boolean
};

class Account extends React.PureComponent<Props, State> {
  state: State = {
    isNominateOpen: false,
    isNominating: false,
    isPrefsOpen: false
  };

  static getDerivedStateFromProps ({ staking_nominating }: Props) {
    const isNominating = !!staking_nominating && !staking_nominating.isEmpty;

    return {
      isNominating
    };
  }

  render () {
    const { accountId, balanceArray, name } = this.props;

    return (
      <article className='staking--Account'>
        {this.renderNominating()}
        {this.renderPrefs()}
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

  private renderNominee () {
    const { staking_nominating, balanceArray } = this.props;
    const { isNominating } = this.state;

    if (!isNominating || !staking_nominating || staking_nominating.isNone) {
      return null;
    }

    const nominating = staking_nominating.unwrap();

    return (
      <AddressMini
        balance={balanceArray(nominating)}
        value={nominating}
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

  private renderNominating () {
    const { intentions } = this.props;
    const { isNominateOpen } = this.state;

    if (!isNominateOpen) {
      return null;
    }

    return (
      <Nominating
        isOpen={isNominateOpen}
        onClose={this.toggleNominate}
        onNominate={this.nominate}
        intentions={intentions}
      />
    );
  }

  private renderPrefs () {
    const { accountId, staking_validatorPreferences } = this.props;
    const { isPrefsOpen } = this.state;

    if (!isPrefsOpen) {
      return null;
    }

    return (
      <Preferences
        accountId={accountId}
        isOpen={isPrefsOpen}
        onClose={this.togglePrefs}
        onSetPrefs={this.setPrefs}
        validatorPreferences={staking_validatorPreferences}
      />
    );
  }

  private renderButtons () {
    const { accountId, intentions, staking_nominating, t } = this.props;
    const { isNominating } = this.state;
    const isIntending = intentions.includes(accountId);
    const canStake = !isIntending && !isNominating;

    if (canStake) {
      return (
        <Button.Group>
          <Button
            isPrimary
            onClick={this.stake}
            label={t('Stake')}
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={this.toggleNominate}
            label={t('Nominate')}
          />
        </Button.Group>
      );
    }

    if (isNominating) {
      return (
        <Button.Group>
          <UnnominateButton
            accountId={accountId || ''}
            nominating={staking_nominating || ''}
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
          label={t('Unstake')}
        />
        <Button.Or />
        <Button
          isPrimary
          onClick={this.togglePrefs}
          label={t('Set Prefs')}
        />
      </Button.Group>
    );
  }

  private send (extrinsic: SubmittableExtrinsic) {
    const { accountId, queueExtrinsic } = this.props;

    queueExtrinsic({
      extrinsic,
      accountId
    });
  }

  private toggleNominate = () => {
    this.setState(
      ({ isNominateOpen }: State) => ({
        isNominateOpen: !isNominateOpen
      })
    );
  }

  private togglePrefs = () => {
    this.setState(
      ({ isPrefsOpen }: State) => ({
        isPrefsOpen: !isPrefsOpen
      })
    );
  }

  private nominate = (nominee: string) => {
    const { api } = this.props;

    this.send(api.tx.staking.nominate(nominee));

    this.toggleNominate();
  }

  private unnominate = (index: number) => {
    const { api } = this.props;

    this.send(api.tx.staking.unnominate(index));
  }

  private setPrefs = (prefs: ValidatorPrefs) => {
    const { api } = this.props;

    this.send(api.tx.staking.registerPreferences(this.getIntentionIndex(), prefs));

    this.togglePrefs();
  }

  private stake = () => {
    const { api } = this.props;

    this.send(api.tx.staking.stake());
  }

  private unstake = () => {
    const { api } = this.props;

    this.send(api.tx.staking.unstake(this.getIntentionIndex()));
  }

  private getIntentionIndex (): number {
    const { accountId, intentions } = this.props;

    return intentions.indexOf(accountId);
  }
}

export default translate(
  withCalls<Props>(
    ['query.staking.nominatorsFor', { paramName: 'accountId' }],
    ['query.staking.nominating', { paramName: 'accountId' }],
    ['query.staking.validatorPreferences', { paramName: 'accountId' }]
  )(Account)
);
