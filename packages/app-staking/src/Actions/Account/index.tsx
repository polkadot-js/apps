// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RecentlyOfflineMap } from '../../types';
import { AccountId, Exposure, StakingLedger, ValidatorPrefs } from '@polkadot/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

import React from 'react';
import styled from 'styled-components';
import { AddressInfo, AddressRow, Button, Card, TxButton } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

import BondEdit from './BondEdit';
import Nominating from './Nominating';
import StartValidating from './StartValidating';
import translate from '../../translate';

type Props = ApiProps & I18nProps & {
  accountId: string,
  recentlyOffline: RecentlyOfflineMap,
  balances_all?: DerivedBalances,
  staking_info?: DerivedStaking,
  stashOptions: Array<KeyringSectionOption>
};

type State = {
  controllerId: string | null,
  isActiveController: boolean,
  isActiveSession: boolean,
  isActiveStash: boolean,
  isBondEditOpen: boolean,
  isNominateOpen: boolean,
  isNominationStash: boolean,
  isSessionKeyOpen: boolean,
  isValidationStash: boolean,
  isStartValidatingOpen: boolean,
  nominators?: Array<AccountId>,
  sessionId: string | null,
  stakers?: Exposure,
  stakingLedger?: StakingLedger,
  stashId: string | null,
  validatorPrefs?: ValidatorPrefs
};

const Wrapper = styled.div`
  display: flex;

  .staking--Accounts {
    flex: 1;
  }

  .staking--Actions-Infos {
    flex: 1;

    .buttons {
      margin-bottom: 1rem;
    }
  }

  .staking--Account-detail {
    display: inline-block;
    vertical-align: top;
  }

  .staking--Account-detail  .staking--label {
    margin: .5rem 1.75rem -0.5rem 4.5rem;
  }
`;

function toIdString (id?: AccountId | null): string | null {
  return id
    ? id.toString()
    : null;
}

class Account extends React.PureComponent<Props, State> {
  state: State = {
    controllerId: null,
    isActiveController: false,
    isActiveSession: false,
    isActiveStash: false,
    isBondEditOpen: false,
    isNominationStash: false,
    isSessionKeyOpen: false,
    isNominateOpen: false,
    isValidationStash: false,
    isStartValidatingOpen: false,
    sessionId: null,
    stashId: null
  };

  static getDerivedStateFromProps ({ staking_info }: Props): State | null {
    if (!staking_info) {
      return null;
    }

    const { accountId, controllerId, nextSessionId, nominators, stakers, stakingLedger, stashId, validatorPrefs } = staking_info;
    const isNominationStash = nominators && nominators.length !== 0;
    const isValidationStash = !isNominationStash;

    return {
      controllerId: toIdString(controllerId),
      isActiveController: accountId.eq(controllerId),
      isActiveSession: accountId.eq(nextSessionId),
      isActiveStash: accountId.eq(stashId),
      isNominationStash,
      isValidationStash,
      nominators,
      sessionId: toIdString(nextSessionId),
      stakers,
      stakingLedger,
      stashId: toIdString(stashId),
      validatorPrefs
    } as State;
  }

  render () {
    const { isActiveStash } = this.state;

    if (!isActiveStash) {
      return null;
    }

    // Each component is rendered and gets a `is[Component]Open` passed in a `isOpen` props.
    // These components will be loaded and return null at the first load (because is[Component]Open === false).
    // This is deliberate in order to display the Component modals in a performant matter later on
    // because their state will already be loaded.
    return (
      <Card>
        {this.renderBondEdit()}
        {this.renderNominating()}
        {this.renderStartValidating()}
        <Wrapper>
          <div className='staking--Accounts'>
            {this.renderStashAccount()}
            {this.renderControllerAccount()}
            {this.renderSessionAccount()}
            {this.renderNominee()}
          </div>
          <div className='staking--Actions-Infos'>
            <div className='buttons'>
              {this.renderButtons()}
            </div>
            <div className='staking--Infos'>
              {this.renderInfos()}
            </div>
            <div className='staking--Infos'>

            </div>
          </div>
        </Wrapper>
      </Card>
    );
  }

  private renderBondEdit () {
    const { staking_info } = this.props;
    const { controllerId, isBondEditOpen, stashId } = this.state;

    if (!isBondEditOpen) {
      return null;
    }

    return (
      <BondEdit
        controllerId={controllerId}
        currentlyBonded={staking_info && staking_info.stakingLedger && staking_info.stakingLedger.active}
        isOpen={isBondEditOpen}
        onClose={this.toggleBondEdit}
        stashId={stashId}
      />
    );
  }

  private renderInfos () {
    const { stashId } = this.state;

    return (
      <AddressInfo
        withBalance={{
          available: false,
          bonded: true,
          free: false,
          redeemable: true,
          unlocking: true
        }}
        withEdit={{
          onBondedEdit: this.toggleBondEdit
        }}
        value={stashId}
      />
    );
  }

  private renderStartValidating () {
    const { isStartValidatingOpen, controllerId, stashId, sessionId, validatorPrefs } = this.state;

    if (!validatorPrefs || !isStartValidatingOpen || !stashId || !controllerId) {
      return null;
    }

    return (
      <StartValidating
        accountId={controllerId}
        hasSessionId={sessionId !== null}
        isOpen
        onClose={this.toggleStartValidating}
        stashId={stashId}
        validatorPrefs={validatorPrefs}
      />
    );
  }

  private renderNominee () {
    const { recentlyOffline, t } = this.props;
    const { nominators } = this.state;

    if (!nominators || !nominators.length) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>{t('nominating')}</label>
        {nominators.map((nomineeId, index) => (
            <AddressRow
              key={index}
              value={nomineeId}
              offlineStatus={recentlyOffline[nomineeId.toString()]}
              withBalance={false}
              withBonded
            />
          ))}
      </div>
    );
  }

  private renderControllerAccount () {
    const { t } = this.props;
    const { controllerId } = this.state;

    if (!controllerId) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>{t('controller')}</label>
        <AddressRow
          value={controllerId}
        />
      </div>
    );
  }

  private renderSessionAccount () {
    const { t } = this.props;
    const { sessionId } = this.state;

    if (!sessionId) {
      return null;
    }

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>{t('session')}</label>
        <AddressRow value={sessionId} />
      </div>
    );
  }

  private renderStashAccount () {
    const { accountId, recentlyOffline, t } = this.props;

    return (
      <div className='staking--Account-detail'>
        <label className='staking--label'>{t('stash')}</label>
        <AddressRow
          value={accountId}
          offlineStatus={recentlyOffline[accountId]}
          withBalance={false}
          withBonded
        />
      </div>
    );
  }

  private renderNominating () {
    const { stashOptions } = this.props;
    const { controllerId, isNominateOpen, stashId } = this.state;

    if (!stashId || !controllerId) {
      return null;
    }

    return (
      <Nominating
        accountId={controllerId}
        isOpen={isNominateOpen}
        onClose={this.toggleNominate}
        stashId={stashId}
        stashOptions={stashOptions}
      />
    );
  }

  private renderButtons () {
    const { t } = this.props;
    const { controllerId,nominators, isNominationStash, validatorPrefs } = this.state;
    const buttons = [];
    const isNominating = !!nominators && nominators.length;
    const isValidating = !!validatorPrefs && !validatorPrefs.isEmpty;

    // if we are validating/nominating show stop
    if (isNominating || isValidating) {
      buttons.push(
        <TxButton
          accountId={controllerId}
          isNegative
          label={
            isNominationStash
              ? t('Stop Nominating')
              : t('Stop Validating')
          }
          key='stop'
          tx='staking.chill'
        />
      );
    } else {
      buttons.push(
        <Button
          isPrimary
          key='validate'
          onClick={this.toggleStartValidating}
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

    return (
      <Button.Group>
        {buttons}
      </Button.Group>
    );
  }

  private toggleBondEdit = () => {
    this.setState(({ isBondEditOpen }) => ({
      isBondEditOpen: !isBondEditOpen
    }));
  }

  private toggleNominate = () => {
    this.setState(({ isNominateOpen }) => ({
      isNominateOpen: !isNominateOpen
    }));
  }

  private toggleStartValidating = () => {
    this.setState(({ isStartValidatingOpen }) => ({
      isStartValidatingOpen: !isStartValidatingOpen
    }));
  }
}

export default translate(
  withCalls<Props>(
    ['derive.staking.info', { paramName: 'accountId' }],
    'query.staking.recentlyOffline',
    ['derive.balances.all', { paramName: 'accountId' }]
  )(Account)
);
