// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RecentlyOfflineMap } from '../../types';
import { AccountId, Exposure, StakingLedger, ValidatorPrefs } from '@polkadot/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

import { Popup } from 'semantic-ui-react';
import React from 'react';
import styled from 'styled-components';
import { AddressInfo, AddressMini, AddressRow, Button, Card, Menu, RecentlyOffline, TxButton } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

import BondExtra from './BondExtra';
import Nominating from './Nominating';
import StartValidating from './StartValidating';
import translate from '../../translate';
import Unbond from './Unbond';

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
  isBondExtraOpen: boolean,
  isNominateOpen: boolean,
  isNominationStash: boolean,
  isSessionKeyOpen: boolean,
  isSettingPopupOpen: boolean,
  isStartValidatingOpen: boolean,
  isUnbondOpen: boolean,
  isValidationStash: boolean,
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

  .staking--Account-detail.actions{
    display: inline-block;
    vertical-align: top;

    .staking--label {
      margin: .5rem 1.75rem -0.5rem 4.5rem;
      text-align: left;
      }
    }
  }

  .staking--Actions-Infos {
    flex: 1;
    display: flex;
    flex-direction: column;

    .buttons {
      margin-bottom: 1rem;
      flex: 0;

      button {
        margin-right: .25rem;
      }
    }

    .staking--balances {
      div {
        justify-content: flex-end;
      }

      .column {
        flex:0;
      }
    }

    .staking--Account-Nominee {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-top: 1em;
      flex: 1;
    }
  }

  .staking--Account-Nominee {
    text-align: right;

    .staking--label {
      margin: 0 2.25rem -.75rem 0;
    }
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
    isBondExtraOpen: false,
    isNominationStash: false,
    isSessionKeyOpen: false,
    isNominateOpen: false,
    isSettingPopupOpen: false,
    isStartValidatingOpen: false,
    isUnbondOpen: false,
    isValidationStash: false,
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
        {this.renderBondExtra()}
        {this.renderNominating()}
        {this.renderStartValidating()}
        {this.renderUnbond()}
        <Wrapper>
          <div className='staking--Accounts'>
            {this.renderStashAccount()}
            {this.renderControllerAccount()}
            {this.renderSessionAccount()}
          </div>
          <div className='staking--Actions-Infos'>
            <div className='buttons'>
              {this.renderButtons()}
            </div>
            <div className='staking--balances'>
              {this.renderInfos()}
            </div>
            {this.renderNominee()}
          </div>
        </Wrapper>
      </Card>
    );
  }

  private renderBondExtra () {
    const { controllerId, isBondExtraOpen, stashId } = this.state;

    return (
      <BondExtra
        controllerId={controllerId}
        isOpen={isBondExtraOpen}
        onClose={this.toggleBondExtra}
        stashId={stashId}
      />
    );
  }

  private renderUnbond () {
    const { controllerId, isUnbondOpen } = this.state;

    return (
      <Unbond
        controllerId={controllerId}
        isOpen={isUnbondOpen}
        onClose={this.toggleUnbond}
      />
    );
  }

  private renderInfos () {
    const { stashId } = this.state;

    return (
      <AddressInfo
        withBalance={{
          available: true,
          bonded: true,
          free: false,
          redeemable: true,
          unlocking: true
        }}
        withValidatorPrefs={true}
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
    const { t } = this.props;
    const { nominators } = this.state;

    if (!nominators || !nominators.length) {
      return null;
    }

    return (
      <div className='staking--Account-Nominee'>
        <label className='staking--label'>{t('nominating')}</label>
        {nominators.map((nomineeId, index) => (
          <AddressMini
            key={index}
            iconInfo={this.renderOffline(nomineeId)}
            value={nomineeId}
            withBalance={false}
            withBonded
          />
        ))}
      </div>
    );
  }

  private renderOffline (address: AccountId | string) {
    const { recentlyOffline } = this.props;

    return (
      <RecentlyOffline
        accountId={address}
        offline={recentlyOffline[address.toString()]}
        tooltip
      />
    );
  }

  private renderControllerAccount () {
    const { t } = this.props;
    const { controllerId } = this.state;

    if (!controllerId) {
      return null;
    }

    return (
      <div className='staking--Account-detail actions'>
        <label className='staking--label'>{t('controller')}</label>
        <AddressRow
          value={controllerId}
          iconInfo={this.renderOffline(controllerId)}
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
      <div className='staking--Account-detail actions'>
        <label className='staking--label'>{t('session')}</label>
        <AddressRow value={sessionId} />
      </div>
    );
  }

  private renderStashAccount () {
    const { accountId, t } = this.props;

    return (
      <div className='staking--Account-detail actions'>
        <label className='staking--label'>{t('stash')}</label>
        <AddressRow
          value={accountId}
          iconInfo={this.renderOffline(accountId)}
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
    const { controllerId, isNominationStash, isSettingPopupOpen, nominators, validatorPrefs } = this.state;
    const buttons = [];
    const isNominating = !!nominators && nominators.length;
    const isValidating = !!validatorPrefs && !validatorPrefs.isEmpty;

    buttons.push(
      <Popup
        key='settings'
        onClose={this.toggleSettingPopup}
        open={isSettingPopupOpen}
        position='bottom left'
        trigger={
          <Button
            icon='setting'
            onClick={this.toggleSettingPopup}
            size='tiny'
          />
        }
      >
        <Menu
          vertical
          text
          onClick={this.toggleSettingPopup}
        >
          <Menu.Item onClick={this.toggleBondExtra}>Bond more funds</Menu.Item>
          <Menu.Item onClick={this.toggleUnbond}>Unbond funds</Menu.Item>
          { isValidating && <Menu.Item onClick={this.toggleStartValidating}>Change validator preferences</Menu.Item>}
        </Menu>
      </Popup>
    );

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
      <>
        <Button.Group>
          {buttons}
        </Button.Group>
      </>
    );
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

  private toggleStartValidating = () => {
    this.setState(({ isStartValidatingOpen }) => ({
      isStartValidatingOpen: !isStartValidatingOpen
    }));
  }

  private toggleSettingPopup = () => {
    this.setState(({ isSettingPopupOpen }) => ({
      isSettingPopupOpen: !isSettingPopupOpen
    }));
  }

  private toggleUnbond = () => {
    this.setState(({ isUnbondOpen }) => ({
      isUnbondOpen: !isUnbondOpen
    }));
  }
}

export default translate(
  withCalls<Props>(
    ['derive.staking.info', { paramName: 'accountId' }],
    ['derive.balances.all', { paramName: 'accountId' }]
  )(Account)
);
