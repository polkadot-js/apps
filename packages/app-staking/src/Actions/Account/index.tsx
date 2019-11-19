/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedStaking, DerivedStakingOnlineStatus, DerivedHeartbeats } from '@polkadot/api-derive/types';
import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, Exposure, StakingLedger, ValidatorPrefs } from '@polkadot/types/interfaces';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

import React from 'react';
import styled from 'styled-components';
import { AddressCard, AddressInfo, AddressMini, AddressRow, Button, Menu, OnlineStatus, Popup, TxButton } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';

import BondExtra from './BondExtra';
import InjectKeys from './InjectKeys';
import Nominate from './Nominate';
import SetControllerAccount from './SetControllerAccount';
import SetRewardDestination from './SetRewardDestination';
import SetSessionKey from './SetSessionKey';
import translate from '../../translate';
import Unbond from './Unbond';
import Validate from './Validate';
import { u8aToHex, u8aConcat } from '@polkadot/util';

interface Props extends ApiProps, I18nProps {
  allStashes?: string[];
  balances_all?: DerivedBalances;
  className?: string;
  isOwnStash: boolean;
  recentlyOnline?: DerivedHeartbeats;
  staking_info?: DerivedStaking;
  stashId: string;
  stashOptions: KeyringSectionOption[];
}

interface State {
  controllerId: string | null;
  destination: number;
  hexSessionIdNext: string | null;
  hexSessionIdQueue: string | null;
  isBondExtraOpen: boolean;
  isInjectOpen: boolean;
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
  onlineStatus: DerivedStakingOnlineStatus;
  sessionIds: string[];
  stakers?: Exposure;
  stakingLedger?: StakingLedger;
  validatorPrefs?: ValidatorPrefs;
}

const DEFAULT_BALANCES = {
  available: true,
  bonded: false,
  total: false,
  redeemable: false,
  unlocking: false
};

const CONTROLLER_BALANCES = {
  available: true,
  bonded: false,
  free: false,
  redeemable: false,
  unlocking: false
};

function toIdString (id?: AccountId | null): string | null {
  return id
    ? id.toString()
    : null;
}

class Account extends React.PureComponent<Props, State> {
  public state: State = {
    controllerId: null,
    destination: 0,
    hexSessionIdNext: null,
    hexSessionIdQueue: null,
    isBondExtraOpen: false,
    isInjectOpen: false,
    isNominateOpen: false,
    isSetControllerAccountOpen: false,
    isSettingPopupOpen: false,
    isSetRewardDestinationOpen: false,
    isSetSessionAccountOpen: false,
    isStashNominating: false,
    isStashValidating: false,
    isUnbondOpen: false,
    isValidateOpen: false,
    onlineStatus: {},
    sessionIds: []
  };

  public static getDerivedStateFromProps ({ allStashes, staking_info, stashId }: Props): Pick<State, never> | null {
    if (!staking_info) {
      return null;
    }

    const { controllerId, nextSessionIds, nominators, rewardDestination, sessionIds, stakers, stakingLedger, validatorPrefs } = staking_info;
    const isStashNominating = nominators && !!nominators.length;
    const isStashValidating = !!allStashes && !!stashId && allStashes.includes(stashId);
    const nextConcat = u8aConcat(...nextSessionIds.map((id): Uint8Array => id.toU8a()));
    const currConcat = u8aConcat(...sessionIds.map((id): Uint8Array => id.toU8a()));

    return {
      controllerId: toIdString(controllerId),
      destination: rewardDestination && rewardDestination.toNumber(),
      hexSessionIdNext: u8aToHex(nextConcat, 48),
      hexSessionIdQueue: u8aToHex(currConcat.length ? currConcat : nextConcat, 48),
      isStashNominating,
      isStashValidating,
      nominees: nominators && nominators.map(toIdString),
      sessionIds: (
        nextSessionIds.length
          ? nextSessionIds
          : sessionIds
      ).map(toIdString),
      stakers,
      stakingLedger,
      validatorPrefs
    };
  }

  public render (): React.ReactNode {
    const { className, isSubstrateV2, stashId, t } = this.props;
    const { controllerId, hexSessionIdNext, hexSessionIdQueue, isBondExtraOpen, isInjectOpen, isStashValidating, isUnbondOpen, nominees, onlineStatus, sessionIds } = this.state;

    // Each component is rendered and gets a `is[Component]Open` passed in a `isOpen` props.
    // These components will be loaded and return null at the first load (because is[Component]Open === false).
    // This is deliberate in order to display the Component modals in a performant matter later on
    // because their state will already be loaded.
    return (
      <AddressCard
        buttons={this.renderButtons()}
        iconInfo={onlineStatus && (
          <OnlineStatus
            isTooltip
            value={onlineStatus}
          />
        )}
        label={t('stash')}
        type='account'
        value={stashId}
        withAddressOrName
        withBalance={DEFAULT_BALANCES}
      >
        <BondExtra
          controllerId={controllerId}
          isOpen={isBondExtraOpen}
          onClose={this.toggleBondExtra}
          stashId={stashId}
        />
        <Unbond
          controllerId={controllerId}
          isOpen={isUnbondOpen}
          onClose={this.toggleUnbond}
          stashId={stashId}
        />
        {isInjectOpen && (
          <InjectKeys onClose={this.toggleInject} />
        )}
        {this.renderSetValidatorPrefs()}
        {this.renderNominate()}
        {this.renderSetControllerAccount()}
        {this.renderSetRewardDestination()}
        {this.renderSetSessionAccount()}
        {this.renderValidate()}
        <div className={className}>
          <div className='staking--Accounts'>
            {controllerId && (
              <div className='staking--Account-detail actions'>
                <AddressRow
                  label={t('controller')}
                  value={controllerId}
                  withAddressOrName
                  withBalance={CONTROLLER_BALANCES}
                />
              </div>
            )}
            {!isSubstrateV2 && !!sessionIds.length && (
              <div className='staking--Account-detail actions'>
                <AddressRow
                  label={t('session')}
                  value={sessionIds[0]}
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
            )}
          </div>
          <div className='staking--Infos'>
            <div className='staking--balances'>
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
                withHexSessionId={ isSubstrateV2 && hexSessionIdNext !== '0x' && [hexSessionIdQueue, hexSessionIdNext]}
                withValidatorPrefs={isStashValidating}
              />
            </div>
            {nominees && !!nominees.length && (
              <div className='staking--Account-Nominee'>
                <label className='staking--label'>{t('nominating')}</label>
                {nominees.map((nomineeId, index): React.ReactNode => (
                  <AddressMini
                    key={index}
                    value={nomineeId}
                    withBalance={false}
                    withBonded
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </AddressCard>
    );
  }

  private renderNominate (): React.ReactNode {
    const { stashId, stashOptions } = this.props;
    const { controllerId, isNominateOpen, nominees } = this.state;

    if (!isNominateOpen || !stashId || !controllerId) {
      return null;
    }

    return (
      <Nominate
        controllerId={controllerId}
        nominees={nominees}
        onClose={this.toggleNominate}
        stashId={stashId}
        stashOptions={stashOptions}
      />
    );
  }

  private renderValidate (): React.ReactNode {
    const { stashId } = this.props;
    const { controllerId, isValidateOpen, validatorPrefs } = this.state;

    if (!controllerId) {
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
    const { isSubstrateV2, t } = this.props;
    const { controllerId, hexSessionIdNext, isSettingPopupOpen, isStashNominating, isStashValidating, sessionIds } = this.state;
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
          icon='stop'
          key='stop'
          tx='staking.chill'
        />
      );
    } else {
      if (!sessionIds.length || (isSubstrateV2 && hexSessionIdNext === '0x')) {
        buttons.push(
          <Button
            isPrimary
            key='set'
            onClick={this.toggleSetSessionAccount}
            label={t('Set Session Key')}
            icon='sign-in'
          />
        );
      } else {
        buttons.push(
          <Button
            isPrimary
            key='validate'
            onClick={this.toggleValidate}
            label={t('Validate')}
            icon='check circle outline'
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
          icon='hand paper outline'
        />
      );
    }

    buttons.push(
      <Popup
        key='settings'
        onClose={this.toggleSettingPopup}
        open={isSettingPopupOpen}
        position='bottom right'
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
    const { balances_all, isOwnStash, isSubstrateV2, t } = this.props;
    const { hexSessionIdNext, isStashNominating, isStashValidating, sessionIds } = this.state;

    // only show a "Bond Additional" button if this stash account actually doesn't bond everything already
    // staking_ledger.total gives the total amount that can be slashed (any active amount + what is being unlocked)
    const canBondExtra = balances_all && balances_all.freeBalance.gtn(0);

    return (
      <Menu
        vertical
        text
        onClick={this.toggleSettingPopup}
      >
        {canBondExtra &&
          <Menu.Item
            disabled={!isOwnStash}
            onClick={this.toggleBondExtra}
          >
            {t('Bond more funds')}
          </Menu.Item>
        }
        <Menu.Item onClick={this.toggleUnbond}>
          {t('Unbond funds')}
        </Menu.Item>
        <Menu.Item
          disabled={!isOwnStash}
          onClick={this.toggleSetControllerAccount}
        >
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
        {!isStashNominating && (!!sessionIds.length || (isSubstrateV2 && hexSessionIdNext !== '0x')) &&
          <Menu.Item onClick={this.toggleSetSessionAccount}>
            {isSubstrateV2 ? t('Change session keys') : t('Change session account')}
          </Menu.Item>
        }
        {isStashNominating &&
          <Menu.Item onClick={this.toggleNominate}>
            {t('Change nominee(s)')}
          </Menu.Item>
        }
        {!isStashNominating && isSubstrateV2 &&
          <Menu.Item onClick={this.toggleInject}>
            {t('Inject session keys (advanced)')}
          </Menu.Item>
        }
      </Menu>
    );
  }

  private renderSetValidatorPrefs (): React.ReactNode {
    const { stashId } = this.props;
    const { controllerId, isValidateOpen, validatorPrefs } = this.state;

    if (!controllerId || !validatorPrefs) {
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
    const { stashId } = this.props;
    const { controllerId, isSetControllerAccountOpen, isStashValidating } = this.state;

    if (!isSetControllerAccountOpen) {
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
    const { stashId } = this.props;
    const { controllerId, isSetSessionAccountOpen, sessionIds } = this.state;

    if (!controllerId) {
      return null;
    }

    return (
      <SetSessionKey
        controllerId={controllerId}
        isOpen={isSetSessionAccountOpen}
        onClose={this.toggleSetSessionAccount}
        sessionIds={sessionIds}
        stashId={stashId}
      />
    );
  }

  private toggleBondExtra = (): void => {
    this.setState(({ isBondExtraOpen }): Pick<State, never> => ({
      isBondExtraOpen: !isBondExtraOpen
    }));
  }

  private toggleInject = (): void => {
    this.setState(({ isInjectOpen }): Pick<State, never> => ({
      isInjectOpen: !isInjectOpen
    }));
  }

  private toggleNominate = (): void => {
    this.setState(({ isNominateOpen }): Pick<State, never> => ({
      isNominateOpen: !isNominateOpen
    }));
  }

  private toggleSetControllerAccount = (): void => {
    this.setState(({ isSetControllerAccountOpen }): Pick<State, never> => ({
      isSetControllerAccountOpen: !isSetControllerAccountOpen
    }));
  }

  private toggleSetRewardDestination = (): void => {
    this.setState(({ isSetRewardDestinationOpen }): Pick<State, never> => ({
      isSetRewardDestinationOpen: !isSetRewardDestinationOpen
    }));
  }

  private toggleSetSessionAccount = (): void => {
    this.setState(({ isSetSessionAccountOpen }): Pick<State, never> => ({
      isSetSessionAccountOpen: !isSetSessionAccountOpen
    }));
  }

  private toggleSettingPopup = (): void => {
    this.setState(({ isSettingPopupOpen }): Pick<State, never> => ({
      isSettingPopupOpen: !isSettingPopupOpen
    }));
  }

  private toggleUnbond = (): void => {
    this.setState(({ isUnbondOpen }): Pick<State, never> => ({
      isUnbondOpen: !isUnbondOpen
    }));
  }

  private toggleValidate = (): void => {
    this.setState(({ isValidateOpen }): Pick<State, never> => ({
      isValidateOpen: !isValidateOpen
    }));
  }
}

export default withMulti(
  styled(Account as React.ComponentClass<Props>)`
    display: flex;

    .staking--Accounts {
      flex: 3;
      display: flex;
      flex-direction: column;
      width: 0px;
    }

    .staking--Account-detail {
      text-align: right;

      &.actions{
        display: inline-block;
        vertical-align: top;
        margin-top: .5rem;
        margin-bottom: 1.5rem;

        &:last-child {
          margin: 0;
        }
      }

      .staking--label {
        margin: 0 1.75rem -0.75rem 0;
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
    ['derive.staking.info', { paramName: 'stashId' }],
    ['derive.balances.all', { paramName: 'stashId' }]
  )
);
