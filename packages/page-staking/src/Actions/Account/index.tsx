// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import { EraIndex, SlashingSpans } from '@polkadot/types/interfaces';
import { StakerState } from '@polkadot/react-hooks/types';
import { SortedTargets } from '../../types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressInfo, AddressMini, AddressSmall, Button, Menu, Popup, StakingBonded, StakingRedeemable, StakingUnbonding, StatusContext, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import { useTranslation } from '../../translate';
import BondExtra from './BondExtra';
import InjectKeys from './InjectKeys';
import ListNominees from './ListNominees';
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
  targets: SortedTargets;
  validators?: string[];
}

function Account ({ className = '', info: { controllerId, destination, destinationId, hexSessionIdNext, hexSessionIdQueue, isLoading, isOwnController, isOwnStash, isStashNominating, isStashValidating, nominating, sessionIds, stakingLedger, stashId }, isDisabled, next, targets, validators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { queueExtrinsic } = useContext(StatusContext);
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances.all, [stashId]);
  const stakingAccount = useCall<DeriveStakingAccount>(api.derive.staking.account, [stashId]);
  const spanCount = useCall<number>(api.query.staking.slashingSpans, [stashId], {
    transform: (optSpans: Option<SlashingSpans>): number =>
      optSpans.isNone
        ? 0
        : optSpans.unwrap().prior.length + 1
  });
  const [isBondExtraOpen, toggleBondExtra] = useToggle();
  const [isInjectOpen, toggleInject] = useToggle();
  const [isNominateOpen, toggleNominate] = useToggle();
  const [isRewardDestinationOpen, toggleRewardDestination] = useToggle();
  const [isSetControllerOpen, toggleSetController] = useToggle();
  const [isSetSessionOpen, toggleSetSession] = useToggle();
  const [isSettingsOpen, toggleSettings] = useToggle();
  const [isUnbondOpen, toggleUnbond] = useToggle();
  const [isValidateOpen, toggleValidate] = useToggle();
  const [hasBonded, setHasBonded] = useState(false);

  useEffect((): void => {
    stakingAccount?.stakingLedger && setHasBonded(
      !stakingAccount.stakingLedger.active.isEmpty
    );
  }, [stakingAccount]);

  const withdrawFunds = useCallback(
    () => {
      queueExtrinsic({
        accountId: controllerId,
        extrinsic: api.tx.staking.withdrawUnbonded.meta.args.length === 1
          ? api.tx.staking.withdrawUnbonded(spanCount || 0)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore (We are doing toHex here since we have a Vec<u8> input)
          : api.tx.staking.withdrawUnbonded()
      });
    },
    [api, controllerId, queueExtrinsic, spanCount]
  );

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={stashId} />
        {isBondExtraOpen && (
          <BondExtra
            controllerId={controllerId}
            onClose={toggleBondExtra}
            stakingInfo={stakingAccount}
            stashId={stashId}
          />
        )}
        {isInjectOpen && (
          <InjectKeys onClose={toggleInject} />
        )}
        {isNominateOpen && controllerId && (
          <Nominate
            controllerId={controllerId}
            next={next}
            nominating={nominating}
            onClose={toggleNominate}
            stashId={stashId}
            targets={targets}
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
            stashId={stashId}
          />
        )}
        {isSetSessionOpen && controllerId && (
          <SetSessionKey
            controllerId={controllerId}
            onClose={toggleSetSession}
            stashId={stashId}
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
      <td className='number ui--media-1200'>{destination}</td>
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
              <ListNominees
                nominating={nominating}
                stashId={stashId}
              />
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
                    key='stop'
                    label={t<string>('Stop')}
                    tx='staking.chill'
                  />
                )
                : (
                  <Button.Group>
                    {(!sessionIds.length || hexSessionIdNext === '0x')
                      ? (
                        <Button
                          icon='sign-in-alt'
                          isDisabled={!isOwnController || isDisabled}
                          key='set'
                          label={t<string>('Session Key')}
                          onClick={toggleSetSession}
                        />
                      )
                      : (
                        <Button
                          icon='certificate'
                          isDisabled={!isOwnController || isDisabled || !hasBonded}
                          key='validate'
                          label={t<string>('Validate')}
                          onClick={toggleValidate}
                        />
                      )
                    }
                    <Button
                      icon='hand-paper'
                      isDisabled={!isOwnController || isDisabled || !hasBonded}
                      key='nominate'
                      label={t<string>('Nominate')}
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
                    icon='ellipsis-v'
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
                    {t<string>('Bond more funds')}
                  </Menu.Item>
                  <Menu.Item
                    disabled={!isOwnController || !stakingAccount || !stakingAccount.stakingLedger || stakingAccount.stakingLedger.active.isEmpty}
                    onClick={toggleUnbond}
                  >
                    {t<string>('Unbond funds')}
                  </Menu.Item>
                  <Menu.Item
                    disabled={!isOwnController || !stakingAccount || !stakingAccount.redeemable || !stakingAccount.redeemable.gtn(0)}
                    onClick={withdrawFunds}
                  >
                    {t<string>('Withdraw unbonded funds')}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    disabled={!isOwnStash}
                    onClick={toggleSetController}
                  >
                    {t<string>('Change controller account')}
                  </Menu.Item>
                  <Menu.Item
                    disabled={!isOwnController}
                    onClick={toggleRewardDestination}
                  >
                    {t<string>('Change reward destination')}
                  </Menu.Item>
                  {isStashValidating &&
                    <Menu.Item
                      disabled={!isOwnController}
                      onClick={toggleValidate}
                    >
                      {t<string>('Change validator preferences')}
                    </Menu.Item>
                  }
                  <Menu.Divider />
                  {!isStashNominating &&
                    <Menu.Item
                      disabled={!isOwnController}
                      onClick={toggleSetSession}
                    >
                      {t<string>('Change session keys')}
                    </Menu.Item>
                  }
                  {isStashNominating &&
                    <Menu.Item
                      disabled={!isOwnController}
                      onClick={toggleNominate}
                    >
                      {t<string>('Set nominees')}
                    </Menu.Item>
                  }
                  {!isStashNominating &&
                    <Menu.Item onClick={toggleInject}>
                      {t<string>('Inject session keys (advanced)')}
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
