// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { SortedTargets } from '@polkadot/app-staking/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { PalletStakingUnappliedSlash } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { Slash } from '../types.js';

import React, { useCallback, useMemo } from 'react';

import { AddressInfo, AddressMini, AddressSmall, Badge, Button, Menu, Popup, StakingBonded, StakingRedeemable, StakingUnbonding, styled, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useQueue, useStakingAsyncApis, useToggle } from '@polkadot/react-hooks';
import { formatNumber, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import useSlashingSpans from '../useSlashingSpans.js';
import BondExtra from './BondExtra.js';
import InjectKeys from './InjectKeys.js';
import KickNominees from './KickNominees.js';
import ListNominees from './ListNominees.js';
import Nominate from './Nominate.js';
import Rebond from './Rebond.js';
import SetControllerAccount from './SetControllerAccount.js';
import SetRewardDestination from './SetRewardDestination.js';
import SetSessionKey from './SetSessionKey.js';
import Unbond from './Unbond.js';
import Validate from './Validate.js';
import WarnBond from './WarnBond.js';

interface Props {
  allSlashes?: [BN, PalletStakingUnappliedSlash[]][];
  className?: string;
  isDisabled?: boolean;
  info: StakerState;
  minCommission?: BN;
  next?: string[];
  targets: SortedTargets;
  validators?: string[];
}

function extractSlashes (stashId: string, allSlashes: [BN, PalletStakingUnappliedSlash[]][] = []): Slash[] {
  return allSlashes
    .map(([era, all]) => ({
      era,
      slashes: all.filter(({ others, validator }) =>
        validator.eq(stashId) || others.some(([nominatorId]) => nominatorId.eq(stashId))
      )
    }))
    .filter(({ slashes }) => slashes.length);
}

function useStashCalls (api: ApiPromise, stashId: string) {
  const params = useMemo(() => [stashId], [stashId]);
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances?.all, params);
  const stakingAccount = useCall<DeriveStakingAccount>(api.derive.staking.account, params);
  const spanCount = useSlashingSpans(stashId);

  return { balancesAll, spanCount, stakingAccount };
}

function Account ({ allSlashes, className = '', info, isDisabled, minCommission, targets }: Props): React.ReactElement<Props> {
  const { controllerId, destination, hexSessionIdNext, hexSessionIdQueue, isLoading, isOwnController, isOwnStash, isStashNominating, isStashValidating, nominating, sessionIds, stakingLedger, stashId } = useMemo(() => info, [info]);
  const { t } = useTranslation();
  const { api } = useApi();
  const { isRelayChain } = useStakingAsyncApis();
  const { queueExtrinsic } = useQueue();
  const [isBondExtraOpen, toggleBondExtra] = useToggle();
  const [isInjectOpen, toggleInject] = useToggle();
  const [isKickOpen, toggleKick] = useToggle();
  const [isNominateOpen, toggleNominate] = useToggle();
  const [isRebondOpen, toggleRebond] = useToggle();
  const [isRewardDestinationOpen, toggleRewardDestination] = useToggle();
  const [isSetControllerOpen, toggleSetController] = useToggle();
  const [isSetSessionOpen, toggleSetSession] = useToggle();
  const [isUnbondOpen, toggleUnbond] = useToggle();
  const [isValidateOpen, toggleValidate] = useToggle();
  const { balancesAll, spanCount, stakingAccount } = useStashCalls(api, stashId);

  const needsSetController = useMemo(
    () => (api.tx.staking.setController.meta.args.length === 1) || (stashId !== controllerId),
    [api, controllerId, stashId]
  );

  const slashes = useMemo(
    () => extractSlashes(stashId, allSlashes),
    [allSlashes, stashId]
  );

  const withdrawFunds = useCallback(
    () => queueExtrinsic({
      accountId: controllerId,
      extrinsic: api.tx.staking.withdrawUnbonded.meta.args.length === 1
        ? api.tx.staking.withdrawUnbonded(spanCount)
        // @ts-expect-error Previous generation
        : api.tx.staking.withdrawUnbonded()
    }),
    [api, controllerId, queueExtrinsic, spanCount]
  );

  const hasBonded = !!stakingAccount?.stakingLedger && !stakingAccount.stakingLedger.active?.isEmpty;

  return (
    <StyledTr className={className}>
      <td className='badge together'>
        {slashes.length !== 0 && (
          <Badge
            color='red'
            hover={t('Slashed in era {{eras}}', {
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
        {isKickOpen && controllerId && (
          <KickNominees
            controllerId={controllerId}
            onClose={toggleKick}
            stashId={stashId}
          />
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
        {isRebondOpen && (
          <Rebond
            controllerId={controllerId}
            onClose={toggleRebond}
            stakingInfo={stakingAccount}
            stashId={stashId}
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
            minCommission={minCommission}
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
              stakingInfo={info}
              withBalance={false}
              withHexSessionId={hexSessionIdNext !== '0x' && [hexSessionIdQueue, hexSessionIdNext]}
              withValidatorPrefs
            />
            <WarnBond
              minBond={targets.minValidatorBond}
              stakingInfo={stakingAccount}
            />
          </td>
        )
        : (
          <td className='all expand'>
            {isStashNominating && (
              <>
                <ListNominees
                  nominating={nominating}
                  stashId={stashId}
                />
                <WarnBond
                  minBond={targets.minNominatorBond}
                  stakingInfo={stakingAccount}
                />
              </>
            )}
          </td>
        )
      }
      <td className='button'>
        {!isLoading && (
          <>
            {(isStashNominating || isStashValidating)
              ? (!isRelayChain &&
                <TxButton
                  accountId={controllerId}
                  icon='stop'
                  isDisabled={!isOwnController || isDisabled}
                  key='stop'
                  label={t('Stop')}
                  tx={api.tx.staking.chill}
                />
              )
              : (
                <Button.Group>
                  {(!sessionIds.length || hexSessionIdNext === '0x')
                    ? (
                      isRelayChain &&
                      <Button
                        icon='sign-in-alt'
                        isDisabled={!isOwnController || isDisabled}
                        key='set'
                        label={t('Session Key')}
                        onClick={toggleSetSession}
                      />
                    )
                    : (
                      !isRelayChain &&
                     <Button
                       icon='certificate'
                       isDisabled={!isOwnController || isDisabled || !hasBonded}
                       key='validate'
                       label={t('Validate')}
                       onClick={toggleValidate}
                     />
                    )
                  }
                  {!isRelayChain &&
                    <Button
                      icon='hand-paper'
                      isDisabled={!isOwnController || isDisabled || !hasBonded}
                      key='nominate'
                      label={t('Nominate')}
                      onClick={toggleNominate}
                    />
                  }
                </Button.Group>
              )
            }
            {isRelayChain
              ? (
                !isStashNominating &&
                <Popup
                  isDisabled={isDisabled}
                  key='settings'
                  value={
                    <Menu>
                      <Menu.Item
                        isDisabled={!isOwnController}
                        label={t('Change session keys')}
                        onClick={toggleSetSession}
                      />
                      <Menu.Item
                        label={t('Inject session keys (advanced)')}
                        onClick={toggleInject}
                      />
                    </Menu>
                  }
                />
              )
              : (
                <Popup
                  isDisabled={isDisabled}
                  key='settings'
                  value={
                    <Menu>
                      <Menu.Item
                        isDisabled={!isOwnStash || !balancesAll?.freeBalance.gtn(0)}
                        label={t('Bond more funds')}
                        onClick={toggleBondExtra}
                      />
                      <Menu.Item
                        isDisabled={!isOwnController || !stakingAccount?.stakingLedger || stakingAccount.stakingLedger.active?.isEmpty}
                        label={t('Unbond funds')}
                        onClick={toggleUnbond}
                      />
                      <Menu.Item
                        isDisabled={!isOwnController || !stakingAccount?.unlocking?.length}
                        label={t('Rebond funds')}
                        onClick={toggleRebond}
                      />
                      <Menu.Item
                        isDisabled={!isOwnController || !stakingAccount?.redeemable || !stakingAccount.redeemable.gtn(0)}
                        label={t('Withdraw unbonded funds')}
                        onClick={withdrawFunds}
                      />
                      <Menu.Divider />
                      <Menu.Item
                        isDisabled={!isOwnStash || !needsSetController}
                        label={t('Change controller account')}
                        onClick={toggleSetController}
                      />
                      <Menu.Item
                        isDisabled={!isOwnController}
                        label={t('Change reward destination')}
                        onClick={toggleRewardDestination}
                      />
                      {isStashValidating && (
                        <>
                          <Menu.Item
                            isDisabled={!isOwnController}
                            label={t('Change validator preferences')}
                            onClick={toggleValidate}
                          />
                          {isFunction(api.tx.staking.kick) && (
                            <Menu.Item
                              isDisabled={!isOwnController}
                              label={t('Remove nominees')}
                              onClick={toggleKick}
                            />
                          )}
                        </>
                      )}
                      <Menu.Divider />
                      {isStashNominating && (
                        <Menu.Item
                          isDisabled={!isOwnController || !targets.validators?.length}
                          label={t('Set nominees')}
                          onClick={toggleNominate}
                        />
                      )}
                    </Menu>
                  }
                />
              )}
          </>
        )}
      </td>
    </StyledTr>
  );
}

const StyledTr = styled.tr`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }
`;

export default React.memo(Account);
