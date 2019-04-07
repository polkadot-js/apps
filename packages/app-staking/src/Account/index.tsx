// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { Nominators } from '../types';

import React from 'react';
import { AccountId, Balance, Exposure, Option, StakingLedger, ValidatorPrefs } from '@polkadot/types';
import { AddressMini, AddressSummary, Button, TxButton } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

import Bonding from './Bonding';
import Nominating from './Nominating';
import SessionKey from './SessionKey';
import Validating from './Validating';
import translate from '../translate';

type Props = ApiProps & I18nProps & {
  accountId: string,
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  intentions: Array<string>,
  isValidator: boolean,
  name: string,
  nominators: Nominators,
  session_nextKeyFor?: Option<AccountId>,
  staking_bonded?: Option<AccountId>,
  staking_ledger?: Option<StakingLedger>,
  staking_stakers?: Exposure,
  staking_validators?: [ValidatorPrefs],
  targets: Array<KeyringSectionOption>,
  validators: Array<string>
};

type State = {
  isBondingOpen: boolean,
  isNominateOpen: boolean,
  isSessionKeyOpen: boolean,
  isValidatingOpen: boolean,
  isUnbondOpen: boolean,
  bondedId: string | null,
  sessionId: string | null,
  stashId: string | null
};

class Account extends React.PureComponent<Props, State> {
  state: State = {
    isBondingOpen: false,
    isSessionKeyOpen: false,
    isNominateOpen: false,
    isValidatingOpen: false,
    isUnbondOpen: false,
    bondedId: null,
    sessionId: null,
    stashId: null
  };

  static getDerivedStateFromProps ({ session_nextKeyFor, staking_bonded, staking_ledger }: Props, state: State): Partial<State> {
    return {
      bondedId: staking_bonded && staking_bonded.isSome
        ? staking_bonded.unwrap().toString()
        : null,
      sessionId: session_nextKeyFor && session_nextKeyFor.isSome
        ? session_nextKeyFor.unwrap().toString()
        : null,
      stashId: staking_ledger && staking_ledger.isSome
        ? staking_ledger.unwrap().stash.toString()
        : null
    };
  }

  render () {
    const { accountId, balanceArray, name } = this.props;

    return (
      <article className='staking--Account'>
        {this.renderBonding()}
        {this.renderNominating()}
        {this.renderSessionKey()}
        {this.renderValidating()}
        <AddressSummary
          balance={balanceArray(accountId)}
          name={name}
          value={accountId}
          identIconSize={96}
        >
          <div className='staking--Account-expand'>
            {this.renderButtons()}
            {this.renderBondedId()}
            {this.renderSessionId()}
            {this.renderStashId()}
            {this.renderNominee()}
            {this.renderNominators()}
          </div>
        </AddressSummary>
      </article>
    );
  }

  private renderBonding () {
    const { accountId } = this.props;
    const { bondedId, isBondingOpen } = this.state;

    return (
      <Bonding
        accountId={accountId}
        bondedId={bondedId}
        isOpen={isBondingOpen}
        onClose={this.toggleBonding}
      />
    );
  }

  private renderValidating () {
    const { accountId, staking_validators } = this.props;
    const { isValidatingOpen, stashId } = this.state;

    if (!staking_validators || !isValidatingOpen || !stashId) {
      return null;
    }

    return (
      <Validating
        accountId={accountId}
        isOpen
        onClose={this.toggleValidating}
        preferences={staking_validators[0]}
        stashId={stashId}
      />
    );
  }

  private renderSessionKey () {
    const { accountId } = this.props;
    const { isSessionKeyOpen } = this.state;

    return (
      <SessionKey
        accountId={accountId}
        isOpen={isSessionKeyOpen}
        onClose={this.toggleSessionKey}
      />
    );
  }

  // private renderUnbond () {
  //   const { accountId } = this.props;
  //   const { controllerId, isBondingOpen } = this.state;

  //   if (!controllerId) {
  //     return null;
  //   }

  //   return (
  //     <UnBond
  //       accountId={accountId}
  //       controllerId={controllerId}
  //       isOpen={isBondingOpen}
  //       onClose={this.toggleBonding}
  //     />
  //   );
  // }

  private getNominees () {
    const { nominators } = this.props;
    const { stashId } = this.state;

    return stashId ? nominators[stashId] : null;
  }

  private renderNominee () {
    const nominees = this.getNominees();

    if (!nominees || !nominees.length) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>nominating</label>
        {
          nominees.map((nomineeId, index) => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance
            />
          ))
        }
      </div>
    );
  }

  private renderNominators () {
    // const { staking_nominatorsFor } = this.props;

    // if (!staking_nominatorsFor) {
    //   return null;
    // }

    // return (
    //   <div className='staking--Account-detail'>
    //     <label className='staking--label'>nominators</label>
    //     <div className='ui--Nominators'>
    //       {staking_nominatorsFor.map((nominator) => (
    //         <AddressMini
    //           isPadded={false}
    //           key={nominator}
    //           value={nominator}
    //           withBalance
    //         />
    //       ))}
    //     </div>
    //   </div>
    // );
  }

  private renderBondedId () {
    const { bondedId } = this.state;

    if (!bondedId) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>controller account</label>
        <AddressMini
          value={bondedId}
          withBalance
        />
      </div>
    );
  }

  private renderSessionId () {
    const { sessionId } = this.state;

    if (!sessionId) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>session account</label>
        <AddressMini
          value={sessionId}
          withBalance
        />
      </div>
    );
  }

  private renderStashId () {
    const { stashId } = this.state;

    if (!stashId) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>stash account</label>
        <AddressMini
          value={stashId}
          withBalance
        />
      </div>
    );
  }

  private renderNominating () {
    const { accountId, intentions, targets } = this.props;
    const { isNominateOpen, stashId } = this.state;

    if (!stashId) {
      return null;
    }

    return (
      <Nominating
        accountId={accountId}
        isOpen={isNominateOpen}
        onClose={this.toggleNominate}
        intentions={intentions}
        stashId={stashId}
        targets={targets}
      />
    );
  }

  private renderButtons () {
    const { accountId, intentions, t } = this.props;
    const { sessionId, bondedId, stashId } = this.state;
    const buttons = [];

    if (!stashId) {
      if (!bondedId) {
        buttons.push(
          <Button
            isPrimary
            key='bond'
            onClick={this.toggleBonding}
            label={t('Bond')}
          />
        );
      } else {
        return null;
      }
    } else {
      const nominees = this.getNominees();
      const isNominating = nominees && nominees.length;
      const isValidating = intentions.indexOf(accountId) !== -1;

      if (!sessionId) {
        buttons.push(
          <Button
            isPrimary
            key='session'
            onClick={this.toggleSessionKey}
            label={t('Set Session Key')}
          />
        );
      } else if (isValidating || isNominating) {
        buttons.push(
          <TxButton
            accountId={accountId}
            isNegative
            label={isValidating ? t('Stop Validating') : t('Stop Nominating')}
            key='stop'
            tx='staking.chill'
          />
        );
      } else {
        buttons.push(
          <Button
            isPrimary
            key='validate'
            onClick={this.toggleValidating}
            label={t('Validate')}
          />
        );
        buttons.push(<Button.Or key='nominate.or' />);
        buttons.push(
          <Button
            isPrimary
            key='nominate'
            onClick={this.toggleNominate}
            label={t('Nominate')}
          />
        );
      }
    }

    return (
      <Button.Group>
        {buttons}
      </Button.Group>
    );
  }

  private toggleBonding = () => {
    this.setState(({ isBondingOpen }) => ({
      isBondingOpen: !isBondingOpen
    }));
  }

  private toggleNominate = () => {
    this.setState(({ isNominateOpen }) => ({
      isNominateOpen: !isNominateOpen
    }));
  }

  private toggleSessionKey = () => {
    this.setState(({ isSessionKeyOpen }) => ({
      isSessionKeyOpen: !isSessionKeyOpen
    }));
  }

  private toggleValidating = () => {
    this.setState(({ isValidatingOpen }) => ({
      isValidatingOpen: !isValidatingOpen
    }));
  }
}

export default translate(
  withCalls<Props>(
    ['query.session.nextKeyFor', { paramName: 'accountId' }],
    ['query.staking.bonded', { paramName: 'accountId' }],
    ['query.staking.ledger', { paramName: 'accountId' }],
    ['query.staking.stakers', { paramName: 'accountId' }],
    ['query.staking.validators', { paramName: 'accountId' }]
  )(Account)
);
