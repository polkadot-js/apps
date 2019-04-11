// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { AccountFilter, Nominators, RecentlyOfflineMap } from '../types';

import React from 'react';
import { AccountId, Balance, Exposure, Option, StakingLedger, ValidatorPrefs } from '@polkadot/types';
import { AddressMini, AddressSummary, Button, TxButton } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

import Bond from './Bond';
import BondExtra from './BondExtra';
import Nominating from './Nominating';
import SessionKey from './SessionKey';
import Validating from './Validating';
import translate from '../translate';

type Props = ApiProps & I18nProps & {
  accountId: string,
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  controllers: Array<string>,
  filter: AccountFilter,
  isValidator: boolean,
  name: string,
  nominators: Nominators,
  recentlyOffline: RecentlyOfflineMap,
  session_nextKeyFor?: Option<AccountId>,
  staking_bonded?: Option<AccountId>,
  staking_ledger?: Option<StakingLedger>,
  staking_stakers?: Exposure,
  staking_validators?: [ValidatorPrefs],
  stashes: Array<string>,
  stashOptions: Array<KeyringSectionOption>,
  validators: Array<string>
};

type State = {
  controllerId: string | null,
  isBondOpen: boolean,
  isBondExtraOpen: boolean,
  isNominateOpen: boolean,
  isSessionKeyOpen: boolean,
  isValidatingOpen: boolean,
  isUnbondOpen: boolean,
  sessionId: string | null,
  stashId: string | null
};

class Account extends React.PureComponent<Props, State> {
  state: State = {
    controllerId: null,
    isBondOpen: false,
    isBondExtraOpen: false,
    isSessionKeyOpen: false,
    isNominateOpen: false,
    isValidatingOpen: false,
    isUnbondOpen: false,
    sessionId: null,
    stashId: null
  };

  static getDerivedStateFromProps ({ session_nextKeyFor, staking_bonded, staking_ledger }: Props, state: State): Partial<State> {
    return {
      controllerId: staking_bonded && staking_bonded.isSome
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
    const { accountId, balanceArray, filter, name } = this.props;
    const { controllerId, stashId } = this.state;

    if ((filter === 'controller' && !stashId) || (filter === 'stash' && !controllerId) || (filter === 'unbonded' && (controllerId || stashId))) {
      return null;
    }

    return (
      <article className='staking--Account'>
        {this.renderBond()}
        {this.renderBondExtra()}
        {this.renderNominating()}
        {this.renderSessionKey()}
        {this.renderValidating()}
        <AddressSummary
          balance={balanceArray(accountId)}
          name={name}
          value={accountId}
          identIconSize={96}
          withBonded
          withIndex={false}
          withNonce={false}
        >
          <div className='staking--Account-expand'>
            {this.renderButtons()}
            {this.renderControllerId()}
            {this.renderStashId()}
            {this.renderSessionId()}
            {this.renderNominee()}
            {this.renderNominators()}
          </div>
        </AddressSummary>
      </article>
    );
  }

  private renderBond () {
    const { accountId } = this.props;
    const { controllerId, isBondOpen } = this.state;

    return (
      <Bond
        accountId={accountId}
        controllerId={controllerId}
        isOpen={isBondOpen}
        onClose={this.toggleBond}
      />
    );
  }

  private renderBondExtra () {
    const { accountId } = this.props;
    const { isBondExtraOpen } = this.state;

    return (
      <BondExtra
        accountId={accountId}
        isOpen={isBondExtraOpen}
        onClose={this.toggleBondExtra}
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
    const { recentlyOffline, t } = this.props;

    const nominees = this.getNominees();

    if (!nominees || !nominees.length) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>{t('nominating')}</label>
        {
          nominees.map((nomineeId, index) => (
            <AddressMini
              key={index}
              value={nomineeId}
              offlineStatus={recentlyOffline[nomineeId]}
              withBalance={false}
              withBonded
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

  private renderControllerId () {
    const { recentlyOffline, t } = this.props;
    const { controllerId } = this.state;

    if (!controllerId) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>{t('controller')}</label>
        <AddressMini
          value={controllerId}
          offlineStatus={recentlyOffline[controllerId]}
        />
      </div>
    );
  }

  private renderSessionId () {
    const { t } = this.props;
    const { sessionId } = this.state;

    if (!sessionId) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>{t('session')}</label>
        <AddressMini value={sessionId} />
      </div>
    );
  }

  private renderStashId () {
    const { recentlyOffline, t } = this.props;
    const { stashId } = this.state;

    if (!stashId) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>{t('stash')}</label>
        <AddressMini
          value={stashId}
          offlineStatus={recentlyOffline[stashId]}
          withBalance={false}
          withBonded
        />
      </div>
    );
  }

  private renderNominating () {
    const { accountId, stashOptions } = this.props;
    const { isNominateOpen, stashId } = this.state;

    if (!stashId) {
      return null;
    }

    return (
      <Nominating
        accountId={accountId}
        isOpen={isNominateOpen}
        onClose={this.toggleNominate}
        stashId={stashId}
        stashOptions={stashOptions}
      />
    );
  }

  private renderButtons () {
    const { accountId, controllers, t } = this.props;
    const { sessionId, controllerId, stashId } = this.state;
    const buttons = [];

    if (!stashId) {
      if (!controllerId) {
        buttons.push(
          <Button
            isPrimary
            key='bond'
            onClick={this.toggleBond}
            label={t('Bond Funds')}
          />
        );
      } else {
        buttons.push(
          <Button
            isPrimary
            key='bond'
            onClick={this.toggleBondExtra}
            label={t('Bond Additional')}
          />
        );
      }
    } else {
      const nominees = this.getNominees();
      const isNominating = nominees && nominees.length;
      const isValidating = controllers.indexOf(accountId) !== -1;

      if (isValidating || isNominating) {
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
        if (!sessionId) {
          buttons.push(
            <Button
              isPrimary
              key='session'
              onClick={this.toggleSessionKey}
              label={t('Set Session Key')}
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
        }
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

  private toggleBond = () => {
    this.setState(({ isBondOpen }) => ({
      isBondOpen: !isBondOpen
    }));
  }

  private toggleBondExtra = () => {
    this.setState(({ isBondExtraOpen }) => ({
      isBondExtraOpen: !isBondExtraOpen
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
    'query.staking.recentlyOffline',
    ['query.session.nextKeyFor', { paramName: 'accountId' }],
    ['query.staking.bonded', { paramName: 'accountId' }],
    ['query.staking.ledger', { paramName: 'accountId' }],
    ['query.staking.stakers', { paramName: 'accountId' }],
    ['query.staking.validators', { paramName: 'accountId' }]
  )(Account)
);
