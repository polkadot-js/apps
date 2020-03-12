// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { DerivedBalancesAll, DerivedStakingAccount, DerivedStakingOverview, DeriveStakerReward } from '@polkadot/api-derive/types';
import { AccountId, EraIndex, Exposure, StakingLedger, ValidatorPrefs } from '@polkadot/types/interfaces';
import { Codec, ITuple } from '@polkadot/types/types';

import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { ApiPromise } from '@polkadot/api';
import { AddressInfo, AddressMini, AddressSmall, Badge, Button, Menu, Popup, Spinner, StatusContext, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { u8aConcat, u8aToHex } from '@polkadot/util';

import { useTranslation } from '../../translate';
import BondExtra from './BondExtra';
// import ClaimRewards from './ClaimRewards';
import InjectKeys from './InjectKeys';
import Nominate from './Nominate';
import SetControllerAccount from './SetControllerAccount';
import SetRewardDestination from './SetRewardDestination';
import SetSessionKey from './SetSessionKey';
import Unbond from './Unbond';
import Validate from './Validate';
import useInactives from './useInactives';

type ValidatorInfo = ITuple<[ValidatorPrefs, Codec]>;

interface Props {
  activeEra?: EraIndex;
  allStashes?: string[];
  className?: string;
  isOwnStash: boolean;
  isVisible: boolean;
  next?: string[];
  onUpdateType: (stashId: string, type: 'validator' | 'nominator' | 'started' | 'other') => void;
  rewards?: DeriveStakerReward[];
  stakingOverview?: DerivedStakingOverview;
  stashId: string;
}

interface StakeState {
  controllerId: string | null;
  destination: number;
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

function getStakeState (allAccounts: string[], allStashes: string[] | undefined, { controllerId: _controllerId, exposure, nextSessionIds, nominators, rewardDestination, sessionIds, stakingLedger, validatorPrefs }: DerivedStakingAccount, stashId: string, validateInfo: ValidatorInfo): StakeState {
  const isStashNominating = !!(nominators?.length);
  const isStashValidating = !validateInfo[1].isEmpty || !!allStashes?.includes(stashId);
  const nextConcat = u8aConcat(...nextSessionIds.map((id): Uint8Array => id.toU8a()));
  const currConcat = u8aConcat(...sessionIds.map((id): Uint8Array => id.toU8a()));
  const controllerId = toIdString(_controllerId);

  return {
    controllerId,
    destination: rewardDestination?.toNumber() || 0,
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

function createPayout (api: ApiPromise, payoutRewards: DeriveStakerReward[]): SubmittableExtrinsic<'promise'> {
  return payoutRewards.length === 1
    ? payoutRewards[0].isValidator
      ? api.tx.staking.payoutValidator(payoutRewards[0].era)
      : api.tx.staking.payoutNominator(payoutRewards[0].era, payoutRewards[0].nominating)
    : api.tx.utility.batch(
      payoutRewards.map(({ era, isValidator, nominating }): SubmittableExtrinsic<'promise'> =>
        isValidator
          ? api.tx.staking.payoutValidator(era)
          : api.tx.staking.payoutNominator(era, nominating)
      )
    );
}

function Account ({ allStashes, className, isOwnStash, next, onUpdateType, rewards, stakingOverview, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { queueExtrinsic } = useContext(StatusContext);
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const validateInfo = useCall<ValidatorInfo>(api.query.staking.validators, [stashId]);
  const balancesAll = useCall<DerivedBalancesAll>(api.derive.balances.all as any, [stashId]);
  const stakingAccount = useCall<DerivedStakingAccount>(api.derive.staking.account as any, [stashId]);
  const [[payoutRewards, payoutEras, payoutTotal], setStakingRewards] = useState<[DeriveStakerReward[], EraIndex[], BN]>([[], [], new BN(0)]);
  const [{ controllerId, destination, hexSessionIdQueue, hexSessionIdNext, isLoading, isOwnController, isStashNominating, isStashValidating, nominees, sessionIds, validatorPrefs }, setStakeState] = useState<StakeState>({ controllerId: null, destination: 0, hexSessionIdNext: null, hexSessionIdQueue: null, isLoading: true, isOwnController: false, isStashNominating: false, isStashValidating: false, sessionIds: [] });
  const [activeNoms, setActiveNoms] = useState<string[]>([]);
  const inactiveNoms = useInactives(stashId, nominees);
  const [isBondExtraOpen, toggleBondExtra] = useToggle();
  // const [isPayoutOpen, togglePayout] = useToggle();
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

      if (state.isStashValidating) {
        onUpdateType(stashId, 'validator');
      } else if (state.isStashNominating) {
        onUpdateType(stashId, 'nominator');
      } else {
        onUpdateType(stashId, 'other');
      }
    }
  }, [allStashes, stakingAccount, stashId, validateInfo]);

  useEffect((): void => {
    nominees && setActiveNoms(
      nominees.filter((id): boolean => !inactiveNoms.includes(id))
    );
  }, [inactiveNoms, nominees]);

  useEffect((): void => {
    rewards && setStakingRewards([
      rewards,
      rewards.map(({ era }): EraIndex => era),
      rewards.reduce((result, { total }) => result.iadd(total), new BN(0))
    ]);
  }, [rewards]);

  const _doPayout = useCallback(
    (): void => queueExtrinsic({
      accountId: controllerId,
      extrinsic: createPayout(api, payoutRewards)
    }),
    [api, controllerId, payoutRewards]
  );

  return (
    <tr className={className}>
      {api.query.staking.activeEra && (
        <td>
          {!rewards
            ? <Spinner variant='mini' />
            : !!payoutEras.length && (
              <Badge
                hover={
                  <>
                    <div>{t('Pending payouts for {{count}} eras:', { replace: { count: payoutEras.length } })}</div>
                    <FormatBalance value={payoutTotal} />
                  </>
                }
                info={payoutEras.length}
                isInline
                isTooltip
                type='counter'
              />
            )
          }
        </td>
      )}
      <td>
        <BondExtra
          controllerId={controllerId}
          isOpen={isBondExtraOpen}
          onClose={toggleBondExtra}
          stashId={stashId}
        />
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
        {/* {isPayoutOpen && controllerId && (
          <ClaimRewards
            controllerId={controllerId}
            onClose={togglePayout}
            payoutRewards={payoutRewards}
          />
        )} */}
        {isInjectOpen && (
          <InjectKeys onClose={toggleInject} />
        )}
        {isNominateOpen && controllerId && (
          <Nominate
            controllerId={controllerId}
            next={next}
            nominees={nominees}
            onClose={toggleNominate}
            stakingOverview={stakingOverview}
            stashId={stashId}
          />
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
            defaultDestination={destination}
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
      <td className='top '>
        <AddressMini
          className='mini-nopad'
          label={t('controller')}
          value={controllerId}
        />
      </td>
      <td className='top'>
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
        />
      </td>
      {isStashValidating
        ? (
          <td className='top'>
            <AddressInfo
              address={stashId}
              withBalance={false}
              withHexSessionId={hexSessionIdNext !== '0x' && [hexSessionIdQueue, hexSessionIdNext]}
              withValidatorPrefs
            />
          </td>
        )
        : (
          <td>
            {isStashNominating && (
              <>
                {activeNoms.length !== 0 && (
                  <details>
                    <summary>{t('Active nominations ({{count}})', { replace: { count: activeNoms.length } })}</summary>
                    {activeNoms.map((nomineeId, index): React.ReactNode => (
                      <AddressMini
                        key={index}
                        value={nomineeId}
                        withBalance={false}
                        withBonded
                      />
                    ))}
                  </details>
                )}
                {inactiveNoms.length !== 0 && (
                  <details>
                    <summary>{t('Inactive nominations ({{count}})', { replace: { count: inactiveNoms.length } })}</summary>
                    {inactiveNoms.map((nomineeId, index): React.ReactNode => (
                      <AddressMini
                        key={index}
                        value={nomineeId}
                        withBalance={false}
                        withBonded
                      />
                    ))}
                  </details>
                )}
              </>
            )}
          </td>
        )
      }
      <td className='top number together'>
        {isLoading
          ? null
          : (
            <>
              {(isStashNominating || isStashValidating)
                ? (
                  <TxButton
                    accountId={controllerId}
                    isDisabled={!isOwnController}
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
                )
                : (
                  <Button.Group>
                    {(!sessionIds.length || hexSessionIdNext === '0x')
                      ? (
                        <Button
                          isDisabled={!isOwnController}
                          isPrimary
                          key='set'
                          onClick={toggleSetSession}
                          label={t('Session Key')}
                          icon='sign-in'
                        />
                      )
                      : (
                        <Button
                          isDisabled={!isOwnController}
                          isPrimary
                          key='validate'
                          onClick={toggleValidate}
                          label={t('Validate')}
                          icon='check circle outline'
                        />
                      )
                    }
                    <Button.Or key='nominate.or' />
                    <Button
                      isDisabled={!isOwnController}
                      isPrimary
                      key='nominate'
                      onClick={toggleNominate}
                      label={t('Nominate')}
                      icon='hand paper outline'
                    />
                  </Button.Group>
                )
              }
              <Popup
                key='settings'
                onClose={toggleSettings}
                open={isSettingsOpen}
                position='bottom right'
                trigger={
                  <Button
                    icon='setting'
                    onClick={toggleSettings}
                  />
                }
              >
                <Menu
                  vertical
                  text
                  onClick={toggleSettings}
                >
                  {api.query.staking.activeEra && (
                    <Menu.Item
                      disabled={payoutEras.length === 0}
                      onClick={_doPayout}
                    >
                      <Trans i18nKey='payoutEras'>
                        {t('Payout reward')}&nbsp;{
                          payoutEras.length
                            ? <>(<FormatBalance value={payoutTotal} />)</>
                            : ''
                        }
                      </Trans>
                    </Menu.Item>
                  )}
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

  .mini-nopad {
    padding: 0;
  }
`);
