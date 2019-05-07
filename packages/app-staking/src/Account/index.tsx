// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, Exposure, Option, StakingLedger, ValidatorPrefs } from '@polkadot/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { AddressMini, AddressSummary, Button, TxButton } from '@polkadot/ui-app';
import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import React from 'react';
import { withCalls } from '@polkadot/ui-api';

import { AccountFilter, RecentlyOfflineMap } from '../types';
import Bond from './Bond';
import BondExtra from './BondExtra';
import Nominating from './Nominating';
import SessionKey from './SessionKey';
import translate from '../translate';
import Unbond from './Unbond';
import Validating from './Validating';

type Props = ApiProps & I18nProps & {
  accountId: string,
  balances: DerivedBalancesMap,
  controllerId?: AccountId | null,
  filter: AccountFilter,
  isValidator: boolean,
  name: string,
  recentlyOffline: RecentlyOfflineMap,
  sessionId?: AccountId | null,
  stashId?: AccountId | null,
  freeBalance?: Balance,
  staking_stakers?: Exposure,
  staking_nominators?: [Array<AccountId>],
  staking_validators?: [ValidatorPrefs],
  stashOptions: Array<KeyringSectionOption>,
  staking_ledger?: StakingLedger
};

type State = {
  isBondOpen: boolean,
  isBondExtraOpen: boolean,
  isNominateOpen: boolean,
  isSessionKeyOpen: boolean,
  isValidatingOpen: boolean,
  isUnbondOpen: boolean
};

class Account extends React.PureComponent<Props, State> {
  state: State = {
    isBondOpen: false,
    isBondExtraOpen: false,
    isSessionKeyOpen: false,
    isNominateOpen: false,
    isValidatingOpen: false,
    isUnbondOpen: false
  };

  render () {
    const { accountId, controllerId, filter, name, stashId } = this.props;

    if ((filter === 'controller' && !stashId) || (filter === 'stash' && !controllerId) || (filter === 'unbonded' && (controllerId || stashId))) {
      return null;
    }

    // Each component is rendered and gets a `is[Component]Openwill` passed in a `isOpen` props.
    // These components will be loaded and return null at the first load (because is[Component]Open === false).
    // This is deliberate in order to display the Component modals in a performant matter later on
    // because their state will already be loaded.
    return (
      <article className='staking--Account'>
        {this.renderBond()}
        {this.renderBondExtra()}
        {this.renderNominating()}
        {this.renderSessionKey()}
        {this.renderUnbond()}
        {this.renderValidating()}
        <AddressSummary
          name={name}
          value={accountId}
          identIconSize={96}
          withBonded
          withIndex={false}
          withNonce={false}
        >
          <div className='staking--Account-expand'>
            {this.renderButtons()}
            <div className='staking--Account-links'>
              {this.renderControllerId()}
              {this.renderStashId()}
              {this.renderSessionId()}
              {this.renderNominee()}
              {this.renderNominators()}
            </div>
          </div>
        </AddressSummary>
      </article>
    );
  }

  private renderBond () {
    const { accountId, controllerId } = this.props;
    const { isBondOpen } = this.state;

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

  private renderUnbond () {
    const { controllerId } = this.props;
    const { isUnbondOpen } = this.state;

    return (
        <Unbond
          controllerId={controllerId}
          isOpen={isUnbondOpen}
          onClose={this.toggleUnbond}
        />
    );
  }

  private renderValidating () {
    const { accountId, stashId, staking_validators } = this.props;
    const { isValidatingOpen } = this.state;

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

  private renderNominee () {
    const { recentlyOffline, staking_nominators, t } = this.props;

    if (!staking_nominators || !staking_nominators[0] || !staking_nominators[0].length) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>{t('nominating')}</label>
        {
          staking_nominators[0].map((nomineeId, index) => (
            <AddressMini
              key={index}
              value={nomineeId}
              offlineStatus={recentlyOffline[nomineeId.toString()]}
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
    const { controllerId, recentlyOffline, t } = this.props;

    if (!controllerId) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>{t('controller')}</label>
        <AddressMini
          value={controllerId}
          offlineStatus={recentlyOffline[controllerId.toString()]}
        />
      </div>
    );
  }

  private renderSessionId () {
    const { sessionId, t } = this.props;

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
    const { recentlyOffline, stashId, t } = this.props;

    if (!stashId) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>{t('stash')}</label>
        <AddressMini
          value={stashId}
          offlineStatus={recentlyOffline[stashId.toString()]}
          withBalance={false}
          withBonded
        />
      </div>
    );
  }

  private renderNominating () {
    const { accountId, stashId, stashOptions } = this.props;
    const { isNominateOpen } = this.state;

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
    const { accountId, controllerId, sessionId, staking_nominators, staking_validators, stashId, freeBalance, staking_ledger, t } = this.props;
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
        // only show a "Bond Additional" button if this stash account actually doesn't bond everything already
        // staking_ledger.total gives the total amount that can be slashed (any active amount + what is being unlocked)
        if (freeBalance && staking_ledger && staking_ledger.total && (freeBalance.gt(staking_ledger.total))) {
          buttons.push(
            <Button
              isPrimary
              key='bond'
              onClick={this.toggleBondExtra}
              label={t('Bond Additional')}
            />
          );
        }
        // don't show the `unbond` button if there's nothing to unbond
        // staking_ledger.active gives the amount that can be unbonded (total - what's being unlocked).
        if (staking_ledger && staking_ledger.active && staking_ledger.active.gtn(0)) {
          buttons.length && buttons.push(<Button.Or key='bondAdditional.or' />);
          buttons.push(
            <Button
              isNegative
              key='unbond'
              onClick={this.toggleUnbond}
              label={t('Unbond')}
            />
          );
        }
      }
    } else {
      const isNominating = !!staking_nominators && !!staking_nominators[0] && staking_nominators[0].length;
      const isValidating = !!staking_validators && !!staking_validators[0] && !(staking_validators[0].isEmpty);

      if (isValidating || isNominating) {
        buttons.push(
          <TxButton
            accountId={accountId}
            isNegative
            label={
              isNominating
                ? t('Stop Nominating')
                : t('Stop Validating')
            }
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

  private toggleUnbond = () => {
    this.setState(({ isUnbondOpen }) => ({
      isUnbondOpen: !isUnbondOpen
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
    ['query.session.nextKeyFor', {
      paramName: 'accountId',
      propName: 'sessionId',
      transform: (session: Option<AccountId>) =>
        session.unwrapOr(null)
    }],
    ['query.staking.bonded', {
      paramName: 'accountId',
      propName: 'controllerId',
      transform: (bonded: Option<AccountId>) =>
        bonded.unwrapOr(null)
    }],
    ['query.staking.ledger', {
      paramName: 'accountId',
      propName: 'stashId',
      transform: (ledger: Option<StakingLedger>) =>
        ledger.unwrapOr({ stash: null }).stash
    }],
    ['query.staking.ledger', {
      paramName: 'controllerId',
      transform: (ledger: Option<StakingLedger>) =>
        ledger.unwrapOr({ stash: null, total: null, active: null })
    }],
    ['query.balances.freeBalance', {
      paramName: 'accountId',
      propName: 'freeBalance'
    }],
    ['query.staking.stakers', { paramName: 'accountId' }],
    ['query.staking.nominators', { paramName: 'stashId' }],
    ['query.staking.validators', { paramName: 'stashId' }]
  )(Account)
);
