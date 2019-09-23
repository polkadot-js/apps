// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, BalanceOf, Permill } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';

import BN from 'bn.js';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import { Button, InputAddress, InputBalance, InputNumber, TxButton, TxComponent } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';

import translate from './translate';

interface Props extends I18nProps, ApiProps, RouteComponentProps {
  basePath: string;
  proposalBond: Permill;
  proposalBondMinimum: BalanceOf;
  spendPeriod: BlockNumber;
  burn: Permill;
  pot: BalanceOf;
}

interface State {
  accountId?: string;
  proposalBond?: BN;
  proposalBondMinimum?: BN;
  spendPeriod?: BN;
  burn?: BN;
  pot?: BN;
}

class Settings extends TxComponent<Props, State> {
  public state: State = {};

  public static getDerivedStateFromProps ({ proposalBond, proposalBondMinimum, spendPeriod, burn, pot }: Props, state: State): State {
    const newState: State = {};

    if (proposalBond && !state.proposalBond) {
      newState.proposalBond = new BN(proposalBond);
    }

    if (proposalBondMinimum && !state.proposalBondMinimum) {
      newState.proposalBondMinimum = new BN(proposalBondMinimum);
    }

    if (spendPeriod && !state.spendPeriod) {
      newState.spendPeriod = new BN(spendPeriod);
    }

    if (burn && !state.burn) {
      newState.burn = new BN(burn);
    }

    if (pot && !state.pot) {
      newState.pot = new BN(pot);
    }

    return newState;
  }

  public render (): React.ReactNode {
    const { t } = this.props;
    const { accountId, proposalBond, proposalBondMinimum, spendPeriod, burn, pot } = this.state;

    const hasConfig = !!proposalBond && !!proposalBondMinimum && !!spendPeriod && !!burn;
    const hasPot = !!pot;

    return (
      <>
        <section>
          <InputAddress
            className='medium'
            label={t('using my account')}
            help={t('The account used to change your settings')}
            type='account'
            onChange={this.onChangeAccount}
          />
        </section>
        {hasConfig && proposalBond && proposalBondMinimum && (
          <section>
            <h1>
              {t('configuration')}
            </h1>
            <InputBalance
              className='medium'
              value={proposalBond}
              help={t('Proposal bond')}
              label={t('proposal bond')}
              onChange={this.onChangeProposalBond}
            />
            <InputBalance
              className='medium'
              value={proposalBondMinimum}
              help={t('Proposal bond minimum')}
              label={t('proposal bond minimum')}
              onChange={this.onChangeProposalBondMinimum}
            />
            <InputNumber
              className='medium'
              help={t('Spend period')}
              label={t('spend period')}
              onChange={this.onChangeSpendPeriod}
              value={spendPeriod}
            />
            <InputNumber
              className='medium'
              help={t('Burn percentage')}
              label={t('burn percentage')}
              onChange={this.onChangeBurn}
              value={burn}
            />
            <Button.Group>
              <TxButton
                accountId={accountId}
                label={t('Submit')}
                icon='sign-in'
                tx='treasury.configure'
                params={[
                  proposalBond.toString(),
                  proposalBondMinimum.toString(),
                  spendPeriod,
                  burn
                ]}
              />
            </Button.Group>
          </section>
        )}
        {hasPot && (
          <section>
            <h1>
              {t('pot')}
            </h1>
            <InputBalance
              className='medium'
              defaultValue={pot}
              help={t('Pot')}
              label={t('pot size')}
              onChange={this.onChangePot}
            />
            <Button.Group>
              <TxButton
                accountId={accountId}
                label={t('Submit')}
                icon='sign-in'
                tx='treasury.setPot'
                params={[pot]}
              />
            </Button.Group>
          </section>
        )}
      </>
    );
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { accountId = prevState.accountId, proposalBond = prevState.proposalBond, proposalBondMinimum = prevState.proposalBondMinimum, spendPeriod = prevState.spendPeriod, burn = prevState.burn, pot = prevState.pot } = newState;
        // const isValid = !!beneficiary && !!value && value.gt(new BN(0)) && !!accountId && accountId.length > 0;

        return {
          accountId,
          proposalBond,
          proposalBondMinimum,
          spendPeriod,
          burn,
          pot
        };
      }
    );
  }

  private onChangeAccount = (accountId: string): void => {
    this.nextState({ accountId });
  }

  private onChangeProposalBond = (proposalBond?: BN): void => {
    this.nextState({ proposalBond });
  }

  private onChangeProposalBondMinimum = (proposalBondMinimum?: BN): void => {
    this.nextState({ proposalBondMinimum });
  }

  private onChangeSpendPeriod = (spendPeriod?: BN): void => {
    this.nextState({ spendPeriod });
  }

  private onChangeBurn = (burn?: BN): void => {
    this.nextState({ burn });
  }

  private onChangePot = (pot?: BN): void => {
    this.nextState({ pot });
  }
}

export default withMulti(
  Settings,
  translate,
  withCalls<Props>(
    ['consts.treasury.proposalBond', { fallbacks: ['query.treasury.proposalBond'], propName: 'proposalBond' }],
    ['consts.treasury.proposalBondMinimum', { fallbacks: ['query.treasury.proposalBondMinimum'], propName: 'proposalBondMinimum' }],
    ['consts.treasury.spendPeriod', { fallbacks: ['query.treasury.spendPeriod'], propName: 'spendPeriod' }],
    ['consts.treasury.burn', { fallbacks: ['query.treasury.burn'], propName: 'burn' }],
    ['query.treasury.pot', { propName: 'pot' }]
  )
);
