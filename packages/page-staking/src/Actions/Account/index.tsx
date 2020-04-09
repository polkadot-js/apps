// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import { AccountId, EraIndex, Exposure, StakingLedger, ValidatorPrefs } from '@polkadot/types/interfaces';
import { Codec, ITuple } from '@polkadot/types/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressInfo, AddressMini, AddressSmall, Button, Expander, Menu, Popup, StakingBonded, StakingRedeemable, StakingUnbonding, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { u8aConcat, u8aToHex } from '@polkadot/util';

import { useTranslation } from '../../translate';
import useInactives from '../useInactives';
import BondExtra from './BondExtra';
import InjectKeys from './InjectKeys';
import Nominate from './Nominate';
import SetControllerAccount from './SetControllerAccount';
import SetRewardDestination from './SetRewardDestination';
import SetSessionKey from './SetSessionKey';
import Unbond from './Unbond';
import Validate from './Validate';

type ValidatorInfo = ITuple<[ValidatorPrefs, Codec]> | ValidatorPrefs;

interface Props {
  activeEra?: EraIndex;
  allStashes?: string[];
  className?: string;
  isInElection?: boolean;
  isOwnStash: boolean;
  next?: string[];
  onUpdateType: (stashId: string, type: 'validator' | 'nominator' | 'started' | 'other') => void;
  stashId: string;
  validators?: string[];
}

interface StakeState {
  controllerId: string | null;
  destination?: string;
  destinationId: number;
  exposure?: Exposure;
  hexSessionIdNext: string | null;
  hexSessionIdQueue: string | null;
  isLoading: boolean;
  isOwnController: boolean;
  isStashNominating: boolean;
  isStashValidating: boolean;
  nominees?: string[];
  sessionIds: string[];
  stakingLedger?: StakingLedger;
  validatorPrefs?: ValidatorPrefs;
}

function toIdString (id?: AccountId | null): string | null {
  return id
    ? id.toString()
    : null;
}

function getStakeState (allAccounts: string[], allStashes: string[] | undefined, { controllerId: _controllerId, exposure, nextSessionIds, nominators, rewardDestination, sessionIds, stakingLedger, validatorPrefs }: DeriveStakingAccount, stashId: string, validateInfo: ValidatorInfo): StakeState {
  const isStashNominating = !!(nominators?.length);
  const isStashValidating = !(Array.isArray(validateInfo) ? validateInfo[1].isEmpty : validateInfo.isEmpty) || !!allStashes?.includes(stashId);
  const nextConcat = u8aConcat(...nextSessionIds.map((id): Uint8Array => id.toU8a()));
  const currConcat = u8aConcat(...sessionIds.map((id): Uint8Array => id.toU8a()));
  const controllerId = toIdString(_controllerId);

  return {
    controllerId,
    destination: rewardDestination?.toString().toLowerCase(),
    destinationId: rewardDestination?.toNumber() || 0,
    exposure,
    hexSessionIdNext: u8aToHex(nextConcat, 48),
    hexSessionIdQueue: u8aToHex(currConcat.length ? currConcat : nextConcat, 48),
    isLoading: false,
    isOwnController: allAccounts.includes(controllerId || ''),
    isStashNominating,
    isStashValidating,
    // we assume that all ids are non-null
    nominees: nominators?.map(toIdString) as string[],
    sessionIds: (
      nextSessionIds.length
        ? nextSessionIds
        : sessionIds
    ).map(toIdString) as string[],
    stakingLedger,
    validatorPrefs
  };
}

function Account ({ allStashes, className, isInElection, isOwnStash, next, onUpdateType, stashId, validators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const validateInfo = useCall<ValidatorInfo>(api.query.staking.validators, [stashId]);
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances.all as any, [stashId]);
  const stakingAccount = useCall<DeriveStakingAccount>(api.derive.staking.account as any, [stashId]);
  const [{ controllerId, destination, destinationId, hexSessionIdNext, hexSessionIdQueue, isLoading, isOwnController, isStashNominating, isStashValidating, nominees, sessionIds, validatorPrefs }, setStakeState] = useState<StakeState>({ controllerId: null, destinationId: 0, hexSessionIdNext: null, hexSessionIdQueue: null, isLoading: true, isOwnController: false, isStashNominating: false, isStashValidating: false, sessionIds: [] });
  const [activeNoms, setActiveNoms] = useState<string[]>([]);
  const inactiveNoms = useInactives(stashId, nominees);
  const [isBondExtraOpen, toggleBondExtra] = useToggle();
  const [isInjectOpen, toggleInject] = useToggle();
  const [isNominateOpen, toggleNominate] = useToggle();
  const [isRewardDestinationOpen, toggleRewardDestination] = useToggle();
  const [isSetControllerOpen, toggleSetController] = useToggle();
  const [isSetSessionOpen, toggleSetSession] = useToggle();
  const [isSettingsOpen, toggleSettings] = useToggle();
  const [isUnbondOpen, toggleUnbond] = useToggle();
  const [isValidateOpen, toggleValidate] = useToggle();

  useEffect((): void => {
    if (stakingAccount && validateInfo) {
      const state = getStakeState(allAccounts, allStashes, stakingAccount, stashId, validateInfo);

      setStakeState(state);
      onUpdateType(
        stashId,
        state.isStashValidating
          ? 'validator'
          : state.isStashNominating
            ? 'nominator'
            : 'other'
      );
    }
  }, [allAccounts, allStashes, onUpdateType, stakingAccount, stashId, validateInfo]);

  useEffect((): void => {
    nominees && setActiveNoms(
      nominees.filter((id): boolean => !inactiveNoms.includes(id))
    );
  }, [inactiveNoms, nominees]);

  return (
    <tr className={className}>
      <td className='address'>
        {controllerId && (
          <Nominate
            controllerId={controllerId}
            isOpen={isNominateOpen}
            next={next}
            nominees={nominees}
            onClose={toggleNominate}
            stashId={stashId}
            validators={validators}
          />
        )}
        <Unbond
          controllerId={controllerId}
          isOpen={isUnbondOpen}
          onClose={toggleUnbond}
          stashId={stashId}
        />
        <Validate
          controllerId={controllerId}
          isOpen={isValidateOpen}
          onClose={toggleValidate}
          stashId={stashId}
          validatorPrefs={validatorPrefs}
        />
        {isBondExtraOpen && (
          <BondExtra
            onClose={toggleBondExtra}
            stashId={stashId}
          />
        )}
        {isInjectOpen && (
          <InjectKeys onClose={toggleInject} />
        )}
        {isSetControllerOpen && (
          <SetControllerAccount
            defaultControllerId={controllerId}
            isValidating={isStashValidating}
            onClose={toggleSetController}
            stashId={stashId}
          />
        )}
        {isRewardDestinationOpen && controllerId && (
          <SetRewardDestination
            controllerId={controllerId}
            defaultDestination={destinationId}
            onClose={toggleRewardDestination}
          />
        )}
        {isSetSessionOpen && controllerId && (
          <SetSessionKey
            controllerId={controllerId}
            onClose={toggleSetSession}
          />
        )}
        <AddressSmall value={stashId} />
      </td>
      <td className='address'>
        <AddressMini value={controllerId} />
      </td>
      <td className='number'>{destination}</td>
      <td className='number'>
        <StakingBonded stakingInfo={stakingAccount} />
        <StakingUnbonding stakingInfo={stakingAccount} />
        <StakingRedeemable stakingInfo={stakingAccount} />
      </td>
      {isStashValidating
        ? (
          <td className='all'>
            <AddressInfo
              address={stashId}
              withBalance={false}
              withHexSessionId={hexSessionIdNext !== '0x' && [hexSessionIdQueue, hexSessionIdNext]}
              withValidatorPrefs
            />
          </td>
        )
        : (
          <td className='all'>
            {isStashNominating && (
              <>
                {activeNoms.length !== 0 && (
                  <Expander summary={t('Active nominations ({{count}})', { replace: { count: activeNoms.length } })}>
                    {activeNoms.map((nomineeId, index): React.ReactNode => (
                      <AddressMini
                        key={index}
                        value={nomineeId}
                        withBalance={false}
                        withBonded
                      />
                    ))}
                  </Expander>
                )}
                {inactiveNoms.length !== 0 && (
                  <Expander summary={t('Inactive nominations ({{count}})', { replace: { count: inactiveNoms.length } })}>
                    {inactiveNoms.map((nomineeId, index): React.ReactNode => (
                      <AddressMini
                        key={index}
                        value={nomineeId}
                        withBalance={false}
                        withBonded
                      />
                    ))}
                  </Expander>
                )}
              </>
            )}
          </td>
        )
      }
      <td className='button'>
        {isLoading
          ? null
          : (
            <>
              {(isStashNominating || isStashValidating)
                ? (
                  <TxButton
                    accountId={controllerId}
                    icon='stop'
                    isDisabled={!isOwnController || isInElection}
                    isPrimary={false}
                    key='stop'
                    label={t('Stop')}
                    tx='staking.chill'
                  />
                )
                : (
                  <Button.Group>
                    {(!sessionIds.length || hexSessionIdNext === '0x')
                      ? (
                        <Button
                          icon='sign-in'
                          isDisabled={!isOwnController || isInElection}
                          key='set'
                          label={t('Session Key')}
                          onClick={toggleSetSession}
                        />
                      )
                      : (
                        <Button
                          icon='check circle outline'
                          isDisabled={!isOwnController || isInElection}
                          key='validate'
                          label={t('Validate')}
                          onClick={toggleValidate}
                        />
                      )
                    }
                    <Button.Or key='nominate.or' />
                    <Button
                      icon='hand paper outline'
                      isDisabled={!isOwnController || isInElection}
                      key='nominate'
                      label={t('Nominate')}
                      onClick={toggleNominate}
                    />
                  </Button.Group>
                )
              }
              <Popup
                isOpen={isSettingsOpen}
                key='settings'
                onClose={toggleSettings}
                trigger={
                  <Button
                    icon='setting'
                    isDisabled={isInElection}
                    onClick={toggleSettings}
                  />
                }
              >
                <Menu
                  onClick={toggleSettings}
                  text
                  vertical
                >
                  <Menu.Item
                    disabled={!isOwnStash && !balancesAll?.freeBalance.gtn(0)}
                    onClick={toggleBondExtra}
                  >
                    {t('Bond more funds')}
                  </Menu.Item>
                  <Menu.Item
                    disabled={!isOwnController}
                    onClick={toggleUnbond}
                  >
                    {t('Unbond funds')}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    disabled={!isOwnStash}
                    onClick={toggleSetController}
                  >
                    {t('Change controller account')}
                  </Menu.Item>
                  <Menu.Item
                    disabled={!isOwnController}
                    onClick={toggleRewardDestination}
                  >
                    {t('Change reward destination')}
                  </Menu.Item>
                  {isStashValidating &&
                    <Menu.Item
                      disabled={!isOwnController}
                      onClick={toggleValidate}
                    >
                      {t('Change validator preferences')}
                    </Menu.Item>
                  }
                  <Menu.Divider />
                  {!isStashNominating &&
                    <Menu.Item
                      disabled={!isOwnController}
                      onClick={toggleSetSession}
                    >
                      {t('Change session keys')}
                    </Menu.Item>
                  }
                  {isStashNominating &&
                    <Menu.Item
                      disabled={!isOwnController}
                      onClick={toggleNominate}
                    >
                      {t('Set nominees')}
                    </Menu.Item>
                  }
                  {!isStashNominating &&
                    <Menu.Item onClick={toggleInject}>
                      {t('Inject session keys (advanced)')}
                    </Menu.Item>
                  }
                </Menu>
              </Popup>
            </>
          )
        }
      </td>
    </tr>
  );
}

export default React.memo(styled(Account)`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }
`);
