// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { DeriveBalancesAccountData, DeriveBalancesAll, DeriveDemocracyLock, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { Raw } from '@polkadot/types';
import type { BlockNumber, ValidatorPrefsTo145, Voting } from '@polkadot/types/interfaces';
import type { PalletBalancesReserveData } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import React, { useRef } from 'react';
import styled from 'styled-components';

import { withCalls, withMulti } from '@polkadot/react-api/hoc';
import { Expander, Icon, Tooltip } from '@polkadot/react-components';
import { useBestNumber } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN_ZERO, formatBalance, formatNumber, isObject } from '@polkadot/util';

import CryptoType from './CryptoType';
import DemocracyLocks from './DemocracyLocks';
import Label from './Label';
import StakingRedeemable from './StakingRedeemable';
import StakingUnbonding from './StakingUnbonding';
import { useTranslation } from './translate';

// true to display, or (for bonded) provided values [own, ...all extras]
export interface BalanceActiveType {
  available?: boolean;
  bonded?: boolean | BN[];
  extraInfo?: [React.ReactNode, React.ReactNode][];
  locked?: boolean;
  redeemable?: boolean;
  reserved?: boolean;
  total?: boolean;
  unlocking?: boolean;
  vested?: boolean;
}

export interface CryptoActiveType {
  crypto?: boolean;
  nonce?: boolean;
}

export interface ValidatorPrefsType {
  unstakeThreshold?: boolean;
  validatorPayment?: boolean;
}

interface Props {
  address: string;
  balancesAll?: DeriveBalancesAll;
  children?: React.ReactNode;
  className?: string;
  democracyLocks?: DeriveDemocracyLock[];
  extraInfo?: [string, string][];
  stakingInfo?: DeriveStakingAccount;
  votingOf?: Voting;
  withBalance?: boolean | BalanceActiveType;
  withBalanceToggle?: false;
  withExtended?: boolean | CryptoActiveType;
  withHexSessionId?: (string | null)[];
  withValidatorPrefs?: boolean | ValidatorPrefsType;
  withLabel?: boolean;
}

const DEFAULT_BALANCES: BalanceActiveType = {
  available: true,
  bonded: true,
  locked: true,
  redeemable: true,
  reserved: true,
  total: true,
  unlocking: true,
  vested: true
};
const DEFAULT_EXTENDED = {
  crypto: true,
  nonce: true
};
const DEFAULT_PREFS = {
  unstakeThreshold: true,
  validatorPayment: true
};

// auxiliary component that helps aligning balances details, fills up the space when no icon for a balance is specified
function IconVoid (): React.ReactElement {
  return <span className='icon-void'>&nbsp;</span>;
}

function lookupLock (lookup: Record<string, string>, lockId: Raw): string {
  const lockHex = lockId.toHuman() as string;

  try {
    return lookup[lockHex] || lockHex;
  } catch (error) {
    return lockHex;
  }
}

// skip balances retrieval of none of this matches
function skipBalancesIf ({ withBalance = true, withExtended = false }: Props): boolean {
  if (withBalance === true || withExtended === true) {
    return false;
  } else if (isObject(withBalance)) {
    // these all pull from the all balances
    if (withBalance.available || withBalance.locked || withBalance.reserved || withBalance.total || withBalance.vested) {
      return false;
    }
  } else if (isObject(withExtended)) {
    if (withExtended.nonce) {
      return false;
    }
  }

  return true;
}

function skipStakingIf ({ stakingInfo, withBalance = true, withValidatorPrefs = false }: Props): boolean {
  if (stakingInfo) {
    return true;
  } else if (withBalance === true || withValidatorPrefs) {
    return false;
  } else if (isObject(withBalance)) {
    if (withBalance.unlocking || withBalance.redeemable) {
      return false;
    } else if (withBalance.bonded) {
      return Array.isArray(withBalance.bonded);
    }
  }

  return true;
}

// calculates the bonded, first being the own, the second being nominated
function calcBonded (stakingInfo?: DeriveStakingAccount, bonded?: boolean | BN[]): [BN, BN[]] {
  let other: BN[] = [];
  let own = BN_ZERO;

  if (Array.isArray(bonded)) {
    other = bonded
      .filter((_, index) => index !== 0)
      .filter((value) => value.gt(BN_ZERO));

    own = bonded[0];
  } else if (stakingInfo && stakingInfo.stakingLedger && stakingInfo.stakingLedger.active && stakingInfo.accountId.eq(stakingInfo.stashId)) {
    own = stakingInfo.stakingLedger.active.unwrap();
  }

  return [own, other];
}

function renderExtended ({ address, balancesAll, withExtended }: Props, t: TFunction): React.ReactNode {
  const extendedDisplay = withExtended === true
    ? DEFAULT_EXTENDED
    : withExtended || undefined;

  if (!extendedDisplay) {
    return null;
  }

  return (
    <div className='column'>
      {balancesAll && extendedDisplay.nonce && (
        <>
          <Label label={t<string>('transactions')} />
          <div className='result'>{formatNumber(balancesAll.accountNonce)}</div>
        </>
      )}
      {extendedDisplay.crypto && (
        <>
          <Label label={t<string>('type')} />
          <CryptoType
            accountId={address}
            className='result'
          />
        </>
      )}
    </div>
  );
}

function renderValidatorPrefs ({ stakingInfo, withValidatorPrefs = false }: Props, t: TFunction): React.ReactNode {
  const validatorPrefsDisplay = withValidatorPrefs === true
    ? DEFAULT_PREFS
    : withValidatorPrefs;

  if (!validatorPrefsDisplay || !stakingInfo || !stakingInfo.validatorPrefs) {
    return null;
  }

  return (
    <>
      <div />
      {validatorPrefsDisplay.unstakeThreshold && (stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).unstakeThreshold && (
        <>
          <Label label={t<string>('unstake threshold')} />
          <div className='result'>
            {(stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).unstakeThreshold.toString()}
          </div>
        </>
      )}
      {validatorPrefsDisplay.validatorPayment && (stakingInfo.validatorPrefs.commission || (stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).validatorPayment) && (
        (stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).validatorPayment
          ? (
            <>
              <Label label={t<string>('commission')} />
              <FormatBalance
                className='result'
                value={(stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).validatorPayment}
              />
            </>
          )
          : (
            <>
              <Label label={t<string>('commission')} />
              <span>{(stakingInfo.validatorPrefs.commission.unwrap().toNumber() / 10_000_000).toFixed(2)}%</span>
            </>
          )
      )}
    </>
  );
}

function createBalanceItems (formatIndex: number, lookup: Record<string, string>, t: TFunction, { address, balanceDisplay, balancesAll, bestNumber, democracyLocks, isAllLocked, otherBonded, ownBonded, stakingInfo, votingOf, withBalanceToggle, withLabel }: { address: string; balanceDisplay: BalanceActiveType; balancesAll?: DeriveBalancesAll | DeriveBalancesAccountData; bestNumber: BlockNumber; democracyLocks?: DeriveDemocracyLock[]; isAllLocked: boolean; otherBonded: BN[]; ownBonded: BN; stakingInfo?: DeriveStakingAccount; votingOf?: Voting; withBalanceToggle: boolean, withLabel: boolean }): React.ReactNode {
  const allItems: React.ReactNode[] = [];
  const deriveBalances = balancesAll as DeriveBalancesAll;

  !withBalanceToggle && balancesAll && balanceDisplay.total && allItems.push(
    <React.Fragment key={0}>
      <Label label={withLabel ? t<string>('total') : ''} />
      <FormatBalance
        className='result'
        formatIndex={formatIndex}
        labelPost={<IconVoid />}
        value={balancesAll.freeBalance.add(balancesAll.reservedBalance)}
      />
    </React.Fragment>
  );
  balancesAll && balanceDisplay.available && deriveBalances.availableBalance && allItems.push(
    <React.Fragment key={1}>
      <Label label={t<string>('transferrable')} />
      <FormatBalance
        className='result'
        formatIndex={formatIndex}
        labelPost={<IconVoid />}
        value={deriveBalances.availableBalance}
      />
    </React.Fragment>
  );

  if (balanceDisplay.vested && deriveBalances?.isVesting) {
    const allVesting = deriveBalances.vesting.filter(({ endBlock }) => bestNumber.lt(endBlock));

    allItems.push(
      <React.Fragment key={2}>
        <Label label={t<string>('vested')} />
        <FormatBalance
          className='result'
          formatIndex={formatIndex}
          labelPost={
            <Icon
              icon='info-circle'
              tooltip={`${address}-vested-trigger`}
            />
          }
          value={deriveBalances.vestedBalance}
        >
          <Tooltip
            text={
              <>
                <div>
                  {formatBalance(deriveBalances.vestedClaimable, { forceUnit: '-' })}
                  <div className='faded'>{t('available to be unlocked')}</div>
                </div>
                {allVesting.map(({ endBlock, locked, perBlock, vested }, index) => (
                  <div
                    className='inner'
                    key={`item:${index}`}
                  >
                    <div>
                      {formatBalance(vested, { forceUnit: '-' })}
                      <div className='faded'>{t('of {{locked}} vested', { replace: { locked: formatBalance(locked, { forceUnit: '-' }) } })}</div>
                    </div>
                    <div>
                      <BlockToTime value={endBlock.sub(bestNumber)} />
                      <div className='faded'>{t('until block')} {formatNumber(endBlock)}</div>
                    </div>
                    <div>
                      {formatBalance(perBlock)}
                      <div className='faded'>{t('per block')}</div>
                    </div>
                  </div>
                ))}
              </>
            }
            trigger={`${address}-vested-trigger`}
          />
        </FormatBalance>
      </React.Fragment>
    );
  }

  const allReserves = (deriveBalances?.namedReserves || []).reduce<PalletBalancesReserveData[]>((t, r) => t.concat(...r), []);
  const hasNamedReserves = !!allReserves && allReserves.length !== 0;

  balanceDisplay.locked && balancesAll && (isAllLocked || deriveBalances.lockedBalance?.gtn(0)) && allItems.push(
    <React.Fragment key={3}>
      <Label label={t<string>('locked')} />
      <FormatBalance
        className='result'
        formatIndex={formatIndex}
        labelPost={
          <>
            <Icon
              icon='info-circle'
              tooltip={`${address}-locks-trigger`}
            />
            <Tooltip
              text={deriveBalances.lockedBreakdown.map(({ amount, id, reasons }, index): React.ReactNode => (
                <div key={index}>
                  {amount?.isMax()
                    ? t<string>('everything')
                    : formatBalance(amount, { forceUnit: '-' })
                  }{id && <div className='faded'>{lookupLock(lookup, id)}</div>}<div className='faded'>{reasons.toString()}</div>
                </div>
              ))}
              trigger={`${address}-locks-trigger`}
            />
          </>
        }
        value={isAllLocked ? 'all' : deriveBalances.lockedBalance}
      />
    </React.Fragment>
  );
  balanceDisplay.reserved && balancesAll?.reservedBalance?.gtn(0) && allItems.push(
    <React.Fragment key={4}>
      <Label label={t<string>('reserved')} />
      <FormatBalance
        className='result'
        formatIndex={formatIndex}
        labelPost={
          hasNamedReserves
            ? (
              <>
                <Icon
                  icon='info-circle'
                  tooltip={`${address}-named-reserves-trigger`}
                />
                <Tooltip
                  text={allReserves.map(({ amount, id }, index): React.ReactNode => (
                    <div key={index}>
                      {formatBalance(amount, { forceUnit: '-' })
                      }{id && <div className='faded'>{lookupLock(lookup, id)}</div>}
                    </div>
                  ))}
                  trigger={`${address}-named-reserves-trigger`}
                />
              </>
            )
            : <IconVoid />
        }
        value={balancesAll.reservedBalance}
      />
    </React.Fragment>
  );
  balanceDisplay.bonded && (ownBonded.gtn(0) || otherBonded.length !== 0) && allItems.push(
    <React.Fragment key={5}>
      <Label label={t<string>('bonded')} />
      <FormatBalance
        className='result'
        formatIndex={formatIndex}
        labelPost={<IconVoid />}
        value={ownBonded}
      >
        {otherBonded.length !== 0 && (
          <>&nbsp;(+{otherBonded.map((bonded, index): React.ReactNode =>
            <FormatBalance
              formatIndex={formatIndex}
              key={index}
              labelPost={<IconVoid />}
              value={bonded}
            />
          )})</>
        )}
      </FormatBalance>
    </React.Fragment>
  );
  balanceDisplay.redeemable && stakingInfo?.redeemable?.gtn(0) && allItems.push(
    <React.Fragment key={6}>
      <Label label={t<string>('redeemable')} />
      <StakingRedeemable
        className='result'
        stakingInfo={stakingInfo}
      />
    </React.Fragment>
  );

  if (balanceDisplay.unlocking) {
    stakingInfo?.unlocking && allItems.push(
      <React.Fragment key={7}>
        <Label label={t<string>('unbonding')} />
        <div className='result'>
          <StakingUnbonding
            iconPosition='right'
            stakingInfo={stakingInfo}
          />
        </div>
      </React.Fragment>
    );

    if (democracyLocks && (democracyLocks.length !== 0)) {
      allItems.push(
        <React.Fragment key={8}>
          <Label label={t<string>('democracy')} />
          <div className='result'>
            <DemocracyLocks value={democracyLocks} />
          </div>
        </React.Fragment>
      );
    } else if (votingOf && votingOf.isDirect) {
      const { prior: [unlockAt, balance] } = votingOf.asDirect;

      balance.gt(BN_ZERO) && unlockAt.gt(BN_ZERO) && allItems.push(
        <React.Fragment key={8}>
          <Label label={t<string>('democracy')} />
          <div className='result'>
            <DemocracyLocks value={[{ balance, isFinished: bestNumber.gt(unlockAt), unlockAt }]} />
          </div>
        </React.Fragment>
      );
    }
  }

  if (withBalanceToggle) {
    return (
      <React.Fragment key={formatIndex}>
        <Expander
          summary={
            <FormatBalance
              formatIndex={formatIndex}
              value={balancesAll && balancesAll.freeBalance.add(balancesAll.reservedBalance)}
            />
          }
        >
          {allItems.length !== 0 && (
            <div className='body column'>
              {allItems}
            </div>
          )}
        </Expander>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment key={formatIndex}>
      {allItems}
    </React.Fragment>
  );
}

function renderBalances (props: Props, lookup: Record<string, string>, bestNumber: BlockNumber | undefined, t: TFunction): React.ReactNode[] {
  const { address, balancesAll, democracyLocks, stakingInfo, votingOf, withBalance = true, withBalanceToggle = false, withLabel = false } = props;
  const balanceDisplay = withBalance === true
    ? DEFAULT_BALANCES
    : withBalance || false;

  if (!bestNumber || !balanceDisplay) {
    return [null];
  }

  const [ownBonded, otherBonded] = calcBonded(stakingInfo, balanceDisplay.bonded);
  const isAllLocked = !!balancesAll && balancesAll.lockedBreakdown.some(({ amount }): boolean => amount?.isMax());
  const baseOpts = { address, balanceDisplay, bestNumber, democracyLocks, isAllLocked, otherBonded, ownBonded, votingOf, withBalanceToggle, withLabel };
  const items = [createBalanceItems(0, lookup, t, { ...baseOpts, balancesAll, stakingInfo })];

  withBalanceToggle && balancesAll?.additional.length && balancesAll.additional.forEach((balancesAll, index): void => {
    items.push(createBalanceItems(index + 1, lookup, t, { ...baseOpts, balancesAll }));
  });

  return items;
}

function AddressInfo (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const bestNumber = useBestNumber();
  const { children, className = '', extraInfo, withBalanceToggle, withHexSessionId } = props;

  const lookup = useRef<Record<string, string>>({
    democrac: t<string>('via Democracy/Vote'),
    phrelect: t<string>('via Council/Vote'),
    'staking ': t<string>('via Staking/Bond'),
    'vesting ': t<string>('via Vesting')
  });

  return (
    <div className={`ui--AddressInfo ${className}${withBalanceToggle ? ' ui--AddressInfo-expander' : ''}`}>
      <div className={`column${withBalanceToggle ? ' column--expander' : ''}`}>
        {renderBalances(props, lookup.current, bestNumber, t)}
        {withHexSessionId && withHexSessionId[0] && (
          <>
            <Label label={t<string>('session keys')} />
            <div className='result'>{withHexSessionId[0]}</div>
          </>
        )}
        {withHexSessionId && withHexSessionId[0] !== withHexSessionId[1] && (
          <>
            <Label label={t<string>('session next')} />
            <div className='result'>{withHexSessionId[1]}</div>
          </>
        )}
        {renderValidatorPrefs(props, t)}
        {extraInfo && (
          <>
            <div />
            {extraInfo.map(([label, value], index): React.ReactNode => (
              <React.Fragment key={`label:${index}`}>
                <Label label={label} />
                <div className='result'>
                  {value}
                </div>
              </React.Fragment>
            ))}
          </>
        )}
      </div>
      {renderExtended(props, t)}
      {children && (
        <div className='column'>
          {children}
        </div>
      )}
    </div>
  );
}

export default withMulti(
  styled(AddressInfo)`
    align-items: flex-start;
    display: flex;
    flex: 1;
    white-space: nowrap;

    &:not(.ui--AddressInfo-expander) {
      justify-content: flex-end;
    }

    .column {
      max-width: 260px;
      &.column--expander {
        width: 17.5rem;

        .ui--Expander {
          width: 100%;

          .summary {
            display: inline-block;
            text-align: right;
            min-width: 12rem;
          }
        }
      }

      &:not(.column--expander) {
        flex: 1;
        display: grid;
        column-gap: 0.75rem;
        row-gap: 0.5rem;
        opacity: 1;

        div.inner {
          margin-top: 0.25rem;

          &:first-child {
            margin-top: 0;
          }
        }

        label {
          grid-column: 1;
          padding-right: 0.5rem;
          text-align: right;
          vertical-align: middle;

          .help.circle.icon {
            display: none;
          }
        }

        .result {
          grid-column: 2;
          text-align: right;

          .ui--Icon,
          .icon-void {
            margin-left: 0.25rem;
            margin-right: 0;
            padding-right: 0 !important;
          }

          .icon-void {
            float: right;
            width: 1em;
          }
        }
      }
    }
  `,
  withCalls<Props>(
    ['derive.balances.all', {
      paramName: 'address',
      propName: 'balancesAll',
      skipIf: skipBalancesIf
    }],
    ['derive.staking.account', {
      paramName: 'address',
      propName: 'stakingInfo',
      skipIf: skipStakingIf
    }],
    ['derive.democracy.locks', {
      paramName: 'address',
      propName: 'democracyLocks',
      skipIf: skipStakingIf
    }],
    ['query.democracy.votingOf', {
      paramName: 'address',
      propName: 'votingOf',
      skipIf: skipStakingIf
    }]
  )
);
