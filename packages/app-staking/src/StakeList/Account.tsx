// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$ExtrinsicAdd } from '@polkadot/ui-app/Status/types';
import { RxBalanceMap } from '@polkadot/api-observable/types';

import BN from 'bn.js';
import React from 'react';
import Api from '@polkadot/api-observable';
import { AccountId, Balance, Extrinsic, Method } from '@polkadot/types';
import { AddressMini, AddressSummary, Button } from '@polkadot/ui-app/index';
import { withApiPromise, withMulti } from '@polkadot/ui-react-rx/with/index';

import Nominating from './Nominating';
import UnnominateButton from './UnnominateButton';
import translate from '../translate';

type Props = I18nProps & {
  query_system_accountNonce?: BN,
  accountId: string,
  balances: RxBalanceMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  name: string,
  query_staking_nominating?: AccountId,
  query_staking_nominatorsFor?: Array<string>,
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
    const { accountId, balanceArray, intentions, name } = this.props;
    const { isNominateOpen } = this.state;

    return (
      <article className='staking--Account'>
        <Nominating
          isOpen={isNominateOpen}
          onClose={this.toggleNominate}
          onNominate={this.nominate}
          intentions={intentions}
        />
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
    const { query_staking_nominating, balanceArray } = this.props;

    if (!query_staking_nominating) {
      return null;
    }

    return (
      <AddressMini
        balance={balanceArray(query_staking_nominating)}
        value={query_staking_nominating}
        withBalance
      />
    );
  }

  private renderNominators () {
    const { query_staking_nominatorsFor } = this.props;

    if (!query_staking_nominatorsFor) {
      return null;
    }

    return (
      <div className='ui--Nominators'>
        {query_staking_nominatorsFor.map((nominator) => (
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

  private renderButtons () {
    const { accountId, intentions, query_staking_nominating, t } = this.props;
    const isIntending = intentions.includes(accountId);
    const isNominating = !!query_staking_nominating;
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
            accountId={accountId || ''}
            nominating={query_staking_nominating || ''}
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

  private send (method: Method) {
    const { query_system_accountNonce, accountId, queueExtrinsic } = this.props;

    queueExtrinsic({
      extrinsic: new Extrinsic({ method }),
      accountNonce: query_system_accountNonce,
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

  private nominate = (nominee: string) => {
    this.send(Api.extrinsics.staking.nominate(nominee));

    this.toggleNominate();
  }

  private unnominate = (index: number) => {
    this.send(Api.extrinsics.staking.unnominate(index));
  }

  private stake = () => {
    this.send(Api.extrinsics.staking.stake());
  }

  private unstake = () => {
    const { accountId, intentions } = this.props;

    this.send(Api.extrinsics.staking.unstake(intentions.indexOf(accountId)));
  }
}

export default withMulti(
  Account,
  translate,
  withApiPromise('query.staking.nominatorsFor', { paramProp: 'accountId' }),
  withApiPromise('query.staking.nominating', { paramProp: 'accountId' }),
  withApiPromise('query.system.accountNonce', { paramProp: 'accountId' })
);
