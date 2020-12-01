// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';

import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { Option } from '@polkadot/types';
import type { SlashingSpans, UnappliedSlash } from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { AddressInfo, AddressMini, AddressSmall, Badge, Button, Menu, Popup, StakingBonded, StakingRedeemable, StakingUnbonding, StatusContext, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import type { SortedTargets } from '../../types';
import type { Slash } from '../types';
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
  allSlashes?: [BN, UnappliedSlash[]][];
  className?: string;
  isDisabled?: boolean;
  info: StakerState;
  next?: string[];
  stashId: string;
  targets: SortedTargets;
  validators?: string[];
}

function extractSlashes (stashId: string, allSlashes: [BN, UnappliedSlash[]][] = []): Slash[] {
  return allSlashes
    .map(([era, all]) => ({
      era,
      slashes: all.filter(({ others, validator }) =>
        validator.eq(stashId) || others.some(([nominatorId]) => nominatorId.eq(stashId))
      )
    }))
    .filter(({ slashes }) => slashes.length);
}

const transformSpan = {
  transform: (optSpans: Option<SlashingSpans>): number =>
    optSpans.isNone
      ? 0
      : optSpans.unwrap().prior.length + 1
};

function useStashCalls (api: ApiPromise, stashId: string) {
  const params = useMemo(() => [stashId], [stashId]);
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances.all, params);
  const spanCount = useCall<number>(api.query.staking.slashingSpans, params, transformSpan);
  const stakingAccount = useCall<DeriveStakingAccount>(api.derive.staking.account, params);

  return { balancesAll, spanCount, stakingAccount };
}

function Account ({ allSlashes, className = '', info: { controllerId, destination, hexSessionIdNext, hexSessionIdQueue, isLoading, isOwnController, isOwnStash, isStashNominating, isStashValidating, nominating, sessionIds, stakingLedger, stashId }, isDisabled, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { queueExtrinsic } = useContext(StatusContext);
  const [isBondExtraOpen, toggleBondExtra] = useToggle();
  const [isInjectOpen, toggleInject] = useToggle();
  const [isNominateOpen, toggleNominate] = useToggle();
  const [isRewardDestinationOpen, toggleRewardDestination] = useToggle();
  const [isSetControllerOpen, toggleSetController] = useToggle();
  const [isSetSessionOpen, toggleSetSession] = useToggle();
  const [isSettingsOpen, toggleSettings] = useToggle();
  const [isUnbondOpen, toggleUnbond] = useToggle();
  const [isValidateOpen, toggleValidate] = useToggle();
  const { balancesAll, spanCount, stakingAccount } = useStashCalls(api, stashId);

  const slashes = useMemo(
    () => extractSlashes(stashId, allSlashes),
    [allSlashes, stashId]
  );

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

  const hasBonded = !!stakingAccount?.stakingLedger && !stakingAccount.stakingLedger.active.isEmpty;

  return (
    <tr className={className}>
      <td className='badge together'>
        {slashes.length !== 0 && (
          <Badge
            color='red'
            hover={t<string>('Slashed in era {{eras}}', {
              replace: {
                eras: slashes.map(({ era }) => formatNumber(era)).join(', ')
              }
            })}
            icon='skull-crossbones'
          />
        )}
      </td>
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
            nominating={nominating}
            onClose={toggleNominate}
            stashId={stashId}
            targets={targets}
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
            defaultDestination={destination}
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
      <td className='start media--1200'>
        {destination?.isAccount
          ? <AddressMini value={destination.asAccount} />
          : destination?.toString()
        }
      </td>
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
          <td className='all expand left'>
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
        {!isLoading && (
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
                    disabled={!isOwnController || !targets.validators?.length}
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
        )}
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
