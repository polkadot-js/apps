/* eslint-disable @typescript-eslint/camelcase */
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
import { AddressCard, AddressInfo, AddressMini, AddressRow, Button, Menu, RecentlyOffline, TxButton } from '@polkadot/ui-app';
import { withCalls, withMulti } from '@polkadot/ui-api';

import BondExtra from './BondExtra';
import Nominate from './Nominate';
import SetControllerAccount from './SetControllerAccount';
import SetRewardDestination from './SetRewardDestination';
import SetSessionAccount from './SetSessionAccount';
import translate from '../../translate';
import Unbond from './Unbond';
import Validate from './Validate';

type Props = ApiProps & I18nProps & {
  accountId: string;
  className?: string;
  recentlyOffline: RecentlyOfflineMap;
  balances_all?: DerivedBalances;
  staking_info?: DerivedStaking;
  stashOptions: KeyringSectionOption[];
};

interface State {
  controllerId: string | null;
  destination: number;
  isActiveStash: boolean;
  isBondExtraOpen: boolean;
  isNominateOpen: boolean;
  isSetControllerAccountOpen: boolean;
  isSetRewardDestinationOpen: boolean;
  isSetSessionAccountOpen: boolean;
  isSettingPopupOpen: boolean;
  isStashNominating: boolean;
  isStashValidating: boolean;
  isUnbondOpen: boolean;
  isValidateOpen: boolean;
  nominees?: string[];
  sessionId: string | null;
  stakers?: Exposure;
  stakingLedger?: StakingLedger;
  stashId: string | null;
  validatorPrefs?: ValidatorPrefs;
}

function toIdString (id?: AccountId | null): string | null {
  return id
    ? id.toString()
    : null;
}

class Account extends React.PureComponent<Props, State> {
  public state: State = {
    controllerId: null,
    destination: 0,
    isActiveStash: false,
    isBondExtraOpen: false,
    isNominateOpen: false,
    isSetControllerAccountOpen: false,
    isSettingPopupOpen: false,
    isSetRewardDestinationOpen: false,
    isSetSessionAccountOpen: false,
    isStashNominating: false,
    isStashValidating: false,
    isUnbondOpen: false,
    isValidateOpen: false,
    sessionId: null,
    stashId: null
  };

  public static getDerivedStateFromProps ({ accountId, staking_info }: Props): State | null {
    if (!staking_info) {
      return null;
    }

    const { controllerId, nextSessionId, nominators, rewardDestination, stakers, stakingLedger, stashId, validatorPrefs } = staking_info;
    const isStashNominating = nominators && nominators.length !== 0;
    const isStashValidating = !!validatorPrefs && !validatorPrefs.isEmpty && !isStashNominating;

    return {
      controllerId: toIdString(controllerId),
      destination: rewardDestination && rewardDestination.toNumber(),
      isActiveStash: accountId === toIdString(stashId),
      isStashNominating,
      isStashValidating,
      nominees: nominators && nominators.map(toIdString),
      sessionId: toIdString(nextSessionId),
      stakers,
      stakingLedger,
      stashId: toIdString(stashId),
      validatorPrefs
    } as unknown as State;
  }

  public render (): React.ReactNode {
    const { className, t } = this.props;
    const { isActiveStash, stashId } = this.state;

    if (!isActiveStash || !stashId) {
      return null;
    }

    // Each component is rendered and gets a `is[Component]Open` passed in a `isOpen` props.
    // These components will be loaded and return null at the first load (because is[Component]Open === false).
    // This is deliberate in order to display the Component modals in a performant matter later on
    // because their state will already be loaded.
    return (
      <AddressCard
        buttons={this.renderButtons()}
        iconInfo={this.renderOffline(stashId)}
        label={t('stash')}
        type='account'
        value={stashId}
        withAddressOrName
        withBalance={{
          available: true,
          bonded: false,
          free: false,
          redeemable: false,
          unlocking: false
        }}
      >
        {this.renderBondExtra()}
        {this.renderSetValidatorPrefs()}
        {this.renderNominate()}
        {this.renderSetControllerAccount()}
        {this.renderSetRewardDestination()}
        {this.renderSetSessionAccount()}
        {this.renderUnbond()}
        {this.renderValidate()}
        <div className={className}>
          <div className='staking--Accounts'>
            {this.renderControllerAccount()}
            {this.renderSessionAccount()}
          </div>
          <div className='staking--Infos'>
            <div className='staking--balances'>
              {this.renderInfos()}
            </div>
            {this.renderNominee()}
          </div>
        </div>
      </AddressCard>
    );
  }

  private renderBondExtra (): React.ReactNode {
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

  private renderUnbond (): React.ReactNode {
    const { controllerId, isUnbondOpen, stashId } = this.state;

    return (
      <Unbond
        controllerId={controllerId}
        isOpen={isUnbondOpen}
        onClose={this.toggleUnbond}
        stashId={stashId}
      />
    );
  }

  private renderInfos (): React.ReactNode {
    const { stashId } = this.state;

    return (
      <AddressInfo
        address={stashId}
        withBalance={{
          available: false,
          bonded: true,
          free: false,
          redeemable: true,
          unlocking: true
        }}
        withRewardDestination
        withValidatorPrefs
      />
    );
  }

  private renderNominee (): React.ReactNode {
    const { t } = this.props;
    const { nominees } = this.state;

    if (!nominees || !nominees.length) {
      return null;
    }

    return (
      <div className='staking--Account-Nominee'>
        <label className='staking--label'>{t('nominating')}</label>
        {nominees.map((nomineeId, index): React.ReactNode => (
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

  private renderOffline (address: AccountId | string): React.ReactNode {
    const { recentlyOffline } = this.props;

    return (
      <RecentlyOffline
        accountId={address}
        offline={recentlyOffline[address.toString()]}
        tooltip
      />
    );
  }

  private renderControllerAccount (): React.ReactNode {
    const { t } = this.props;
    const { controllerId } = this.state;

    if (!controllerId) {
      return null;
    }

    return (
      <div className='staking--Account-detail actions'>
        <AddressRow
          iconInfo={this.renderOffline(controllerId)}
          label={t('controller')}
          value={controllerId}
          withAddressOrName
          withBalance={{
            available: true,
            bonded: false,
            free: false,
            redeemable: false,
            unlocking: false
          }}
        />
      </div>

    );
  }

  private renderSessionAccount (): React.ReactNode {
    const { t } = this.props;
    const { sessionId } = this.state;

    if (!sessionId) {
      return null;
    }

    return (
      <div className='staking--Account-detail actions'>
        <AddressRow
          label={t('session')}
          value={sessionId}
          withAddressOrName
          withBalance={{
            available: true,
            bonded: false,
            free: false,
            redeemable: false,
            unlocking: false
          }}
        />
      </div>
    );
  }

  private renderNominate (): React.ReactNode {
    const { stashOptions } = this.props;
    const { controllerId, isNominateOpen, nominees, stashId } = this.state;

    if (!stashId || !controllerId) {
      return null;
    }

    return (
      <Nominate
        controllerId={controllerId}
        isOpen={isNominateOpen}
        nominees={nominees}
        onClose={this.toggleNominate}
        stashId={stashId}
        stashOptions={stashOptions}
      />
    );
  }

  private renderValidate (): React.ReactNode {
    const { controllerId, isValidateOpen, stashId, validatorPrefs } = this.state;

    if (!stashId || !controllerId) {
      return null;
    }

    return (
      <Validate
        controllerId={controllerId}
        isOpen={isValidateOpen}
        onClose={this.toggleValidate}
        stashId={stashId}
        validatorPrefs={validatorPrefs}
      />
    );
  }

  private renderButtons (): React.ReactNode {
    const { t } = this.props;
    const { controllerId, isSettingPopupOpen, isStashNominating, isStashValidating, sessionId } = this.state;
    const buttons = [];

    // if we are validating/nominating show stop
    if (isStashNominating || isStashValidating) {
      buttons.push(
        <TxButton
          accountId={controllerId}
          isNegative
          label={
            isStashNominating
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
            key='set'
            onClick={this.toggleSetSessionAccount}
            label={t('Set Session Key')}
          />
        );
      } else {
        buttons.push(
          <Button
            isPrimary
            key='validate'
            onClick={this.toggleValidate}
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
        {this.renderPopupMenu()}
      </Popup>
    );

    return (
      <>
        <Button.Group>
          {buttons}
        </Button.Group>
      </>
    );
  }

  private renderPopupMenu (): React.ReactNode {
    const { balances_all, t } = this.props;
    const { isStashNominating, isStashValidating, sessionId } = this.state;

    // only show a "Bond Additional" button if this stash account actually doesn't bond everything already
    // staking_ledger.total gives the total amount that can be slashed (any active amount + what is being unlocked)
    const canBondExtra = balances_all && balances_all.availableBalance.gtn(0);

    return (
      <Menu
        vertical
        text
        onClick={this.toggleSettingPopup}
      >
        {canBondExtra &&
          <Menu.Item onClick={this.toggleBondExtra}>
            {t('Bond more funds')}
          </Menu.Item>
        }
        <Menu.Item onClick={this.toggleUnbond}>
          {t('Unbond funds')}
        </Menu.Item>
        <Menu.Item onClick={this.toggleSetControllerAccount}>
          {t('Change controller account')}
        </Menu.Item>
        <Menu.Item onClick={this.toggleSetRewardDestination}>
          {t('Change reward destination')}
        </Menu.Item>
        {isStashValidating &&
          <Menu.Item onClick={this.toggleValidate}>
            {t('Change validator preferences')}
          </Menu.Item>
        }
        {sessionId &&
          <Menu.Item onClick={this.toggleSetSessionAccount}>
            {t('Change session account')}
          </Menu.Item>
        }
        {isStashNominating &&
          <Menu.Item onClick={this.toggleNominate}>
            {t('Change nominee(s)')}
          </Menu.Item>
        }
      </Menu>
    );
  }

  private renderSetValidatorPrefs (): React.ReactNode {
    const { controllerId, isValidateOpen, stashId, validatorPrefs } = this.state;

    if (!controllerId || !validatorPrefs || !stashId) {
      return null;
    }

    return (
      <Validate
        controllerId={controllerId}
        isOpen={isValidateOpen}
        onClose={this.toggleValidate}
        stashId={stashId}
        validatorPrefs={validatorPrefs}
      />
    );
  }

  private renderSetControllerAccount (): React.ReactNode {
    const { controllerId, isSetControllerAccountOpen, isStashValidating, stashId } = this.state;

    if (!isSetControllerAccountOpen || !stashId) {
      return null;
    }

    return (
      <SetControllerAccount
        defaultControllerId={controllerId}
        isValidating={isStashValidating}
        onClose={this.toggleSetControllerAccount}
        stashId={stashId}
      />
    );
  }

  private renderSetRewardDestination (): React.ReactNode {
    const { controllerId, destination, isSetRewardDestinationOpen } = this.state;

    if (!isSetRewardDestinationOpen || !controllerId) {
      return null;
    }

    return (
      <SetRewardDestination
        controllerId={controllerId}
        defaultDestination={destination}
        onClose={this.toggleSetRewardDestination}
      />
    );
  }

  private renderSetSessionAccount (): React.ReactNode {
    const { controllerId, isSetSessionAccountOpen, stashId, sessionId } = this.state;

    if (!controllerId || !stashId) {
      return null;
    }

    return (
      <SetSessionAccount
        controllerId={controllerId}
        isOpen={isSetSessionAccountOpen}
        onClose={this.toggleSetSessionAccount}
        sessionId={sessionId}
        stashId={stashId}
      />
    );
  }

  private toggleBondExtra = (): void => {
    this.setState(({ isBondExtraOpen }): State => ({
      isBondExtraOpen: !isBondExtraOpen
    }) as unknown as State);
  }

  private toggleNominate = (): void => {
    this.setState(({ isNominateOpen }): State => ({
      isNominateOpen: !isNominateOpen
    }) as unknown as State);
  }

  private toggleSetControllerAccount = (): void => {
    this.setState(({ isSetControllerAccountOpen }): State => ({
      isSetControllerAccountOpen: !isSetControllerAccountOpen
    }) as unknown as State);
  }

  private toggleSetRewardDestination = (): void => {
    this.setState(({ isSetRewardDestinationOpen }): State => ({
      isSetRewardDestinationOpen: !isSetRewardDestinationOpen
    }) as unknown as State);
  }

  private toggleSetSessionAccount = (): void => {
    this.setState(({ isSetSessionAccountOpen }): State => ({
      isSetSessionAccountOpen: !isSetSessionAccountOpen
    }) as unknown as State);
  }

  private toggleSettingPopup = (): void => {
    this.setState(({ isSettingPopupOpen }): State => ({
      isSettingPopupOpen: !isSettingPopupOpen
    }) as unknown as State);
  }

  private toggleUnbond = (): void => {
    this.setState(({ isUnbondOpen }): State => ({
      isUnbondOpen: !isUnbondOpen
    }) as unknown as State);
  }

  private toggleValidate = (): void => {
    this.setState(({ isValidateOpen }): State => ({
      isValidateOpen: !isValidateOpen
    }) as unknown as State);
  }
}

export default withMulti(
  styled(Account as React.ComponentClass<Props>)`
    display: flex;

    .staking--Accounts {
      flex: 1;
      display: flex;
      flex-direction: column
    }

    .staking--Account-detail.actions{
      display: inline-block;
      vertical-align: top;
      margin-top: .5rem;
      margin-bottom: 1.5rem;

      &:last-child {
        margin: 0;
      }
    }

    .staking--Infos {
      flex: 1;
      display: flex;
      flex-direction: column;

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

    .ui--Row-buttons .ui--Button-Group {
      margin-right: .25rem;

      .ui.tiny.icon.button {
        visibility: visible;
      }
    }
  `,
  translate,
  withCalls<Props>(
    ['derive.staking.info', { paramName: 'accountId' }],
    ['derive.balances.all', { paramName: 'accountId' }]
  )
);
