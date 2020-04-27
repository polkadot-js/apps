// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import { EraIndex } from '@polkadot/types/interfaces';
import { StakerState } from '@polkadot/react-hooks/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressInfo, AddressMini, AddressSmall, Button, Expander, Menu, Popup, StakingBonded, StakingRedeemable, StakingUnbonding, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

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

interface Props {
  activeEra?: EraIndex;
  className?: string;
  isDisabled?: boolean;
  info: StakerState;
  next?: string[];
  stashId: string;
  validators?: string[];
}

function Account ({ className, info: { controllerId, destination, destinationId, hexSessionIdNext, hexSessionIdQueue, isLoading, isOwnController, isOwnStash, isStashNominating, isStashValidating, nominating, sessionIds, stakingLedger, stashId }, isDisabled, next, validators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances.all, [stashId]);
  const stakingAccount = useCall<DeriveStakingAccount>(api.derive.staking.account, [stashId]);
  const [activeNoms, setActiveNoms] = useState<string[]>([]);
  const inactiveNoms = useInactives(stashId, nominating);
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
    nominating && setActiveNoms(
      nominating.filter((id): boolean => !inactiveNoms.includes(id))
    );
  }, [inactiveNoms, nominating]);

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={stashId} />
        {isBondExtraOpen && (
          <BondExtra
            onClose={toggleBondExtra}
            stashId={stashId}
          />
        )}
        {isInjectOpen && (
          <InjectKeys onClose={toggleInject} />
        )}
        {isNominateOpen && controllerId && (
          <Nominate
            controllerId={controllerId}
            isOpen={isNominateOpen}
            next={next}
            nominating={nominating}
            onClose={toggleNominate}
            stashId={stashId}
            validators={validators}
          />
        )}
        {isSetControllerOpen && controllerId && (
          <SetControllerAccount
            defaultControllerId={controllerId}
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
        {isUnbondOpen && (
          <Unbond
            controllerId={controllerId}
            onClose={toggleUnbond}
            stakingLedger={stakingLedger}
            stashId={stashId}
          />
        )}
        {isValidateOpen && controllerId && (
          <Validate
            controllerId={controllerId}
            onClose={toggleValidate}
            stashId={stashId}
          />
        )}
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
                    isDisabled={!isOwnController || isDisabled}
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
                          isDisabled={!isOwnController || isDisabled}
                          key='set'
                          label={t('Session Key')}
                          onClick={toggleSetSession}
                        />
                      )
                      : (
                        <Button
                          icon='check circle outline'
                          isDisabled={!isOwnController || isDisabled}
                          key='validate'
                          label={t('Validate')}
                          onClick={toggleValidate}
                        />
                      )
                    }
                    <Button.Or key='nominate.or' />
                    <Button
                      icon='hand paper outline'
                      isDisabled={!isOwnController || isDisabled}
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
                    isDisabled={isDisabled}
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
