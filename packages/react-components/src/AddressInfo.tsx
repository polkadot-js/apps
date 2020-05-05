// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import { LockIdentifier, ValidatorPrefsTo145 } from '@polkadot/types/interfaces';
import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { formatBalance, formatNumber, hexToString, isObject } from '@polkadot/util';
import { Expander, Icon, Tooltip } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api/hoc';
import { useAccounts } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import StakingRedeemable from './StakingRedeemable';
import StakingUnbonding from './StakingUnbonding';
import CryptoType from './CryptoType';
import Label from './Label';
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

interface Props extends BareProps {
  address: string;
  balancesAll?: DeriveBalancesAll;
  children?: React.ReactNode;
  extraInfo?: [string, string][];
  stakingInfo?: DeriveStakingAccount;
  withBalance?: boolean | BalanceActiveType;
  withBalanceToggle?: false;
  withExtended?: boolean | CryptoActiveType;
  withHexSessionId?: (string | null)[];
  withValidatorPrefs?: boolean | ValidatorPrefsType;
  withoutLabel?: boolean;
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

function lookupLock (lookup: Record<string, string>, lockId: LockIdentifier): string {
  const lockHex = lockId.toHex();

  try {
    const lockName = hexToString(lockHex);

    return lookup[lockName] || lockName;
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
  let own = new BN(0);

  if (Array.isArray(bonded)) {
    other = bonded
      .filter((_, index): boolean => index !== 0)
      .filter((value): boolean => value.gtn(0));

    own = bonded[0];
  } else if (stakingInfo && stakingInfo.stakingLedger && stakingInfo.accountId.eq(stakingInfo.stashId)) {
    own = stakingInfo.stakingLedger.active.unwrap();
  }

  return [own, other];
}

function renderExtended ({ address, balancesAll, withExtended }: Props, t: (key: string) => string): React.ReactNode {
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
          <Label label={t('transactions')} />
          <div className='result'>{formatNumber(balancesAll.accountNonce)}</div>
        </>
      )}
      {extendedDisplay.crypto && (
        <>
          <Label label={t('type')} />
          <CryptoType
            accountId={address}
            className='result'
          />
        </>
      )}
    </div>
  );
}

function renderValidatorPrefs ({ stakingInfo, withValidatorPrefs = false }: Props, t: (key: string) => string): React.ReactNode {
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
          <Label label={t('unstake threshold')} />
          <div className='result'>
            {(stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).unstakeThreshold.toString()}
          </div>
        </>
      )}
      {validatorPrefsDisplay.validatorPayment && (stakingInfo.validatorPrefs.commission || (stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).validatorPayment) && (
        (stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).validatorPayment
          ? (
            <>
              <Label label={t('commission')} />
              <FormatBalance
                className='result'
                value={(stakingInfo.validatorPrefs as any as ValidatorPrefsTo145).validatorPayment}
              />
            </>
          )
          : (
            <>
              <Label label={t('commission')} />
              <span>{(stakingInfo.validatorPrefs.commission.unwrap().toNumber() / 10_000_000).toFixed(2)}%</span>
            </>
          )
      )}
    </>
  );
}

function renderBalances (props: Props, allAccounts: string[], t: (key: string) => string): React.ReactNode {
  const { address, balancesAll, stakingInfo, withBalance = true, withBalanceToggle = false } = props;
  const balanceDisplay = withBalance === true
    ? DEFAULT_BALANCES
    : withBalance || false;

  if (!balanceDisplay) {
    return null;
  }

  const [ownBonded, otherBonded] = calcBonded(stakingInfo, balanceDisplay.bonded);
  const isAllLocked = !!balancesAll && balancesAll.lockedBreakdown.some(({ amount }): boolean => amount.isMax());
  const lookup = {
    democrac: t('via Democracy/Vote'),
    phrelect: t('via Council/Vote'),
    'staking ': t('via Staking/Bond'),
    'vesting ': t('via Vesting')
  };

  const allItems = (
    <>
      {!withBalanceToggle && balancesAll && balanceDisplay.total && (
        <>
          <Label label={t('total')} />
          <FormatBalance
            className='result'
            value={balancesAll.votingBalance}
          />
        </>
      )}
      {balancesAll && balanceDisplay.available && (
        <>
          <Label label={t('transferrable')} />
          <FormatBalance
            className='result'
            value={balancesAll.availableBalance}
          />
        </>
      )}
      {balanceDisplay.vested && balancesAll?.isVesting && (
        <>
          <Label label={t('vested')} />
          <FormatBalance
            className='result'
            value={balancesAll.vestedBalance}
          />
        </>
      )}
      {balanceDisplay.locked && balancesAll && (isAllLocked || balancesAll.lockedBalance.gtn(0)) && (
        <>
          <Label label={t('locked')} />
          <FormatBalance
            className='result'
            label={
              <Icon
                data-for={`${address}-locks-trigger`}
                data-tip
                name='info circle'
              />
            }
            value={isAllLocked ? 'all' : balancesAll.lockedBalance}
          >
            <Tooltip
              text={balancesAll.lockedBreakdown.map(({ amount, id, reasons }, index): React.ReactNode => (
                <div key={index}>
                  {amount.isMax()
                    ? t('everything')
                    : formatBalance(amount, { forceUnit: '-' })
                  }{id && <div className='faded'>{lookupLock(lookup, id)}</div>}<div className='faded'>{reasons.toString()}</div>
                </div>
              ))}
              trigger={`${address}-locks-trigger`}
            />
          </FormatBalance>
        </>
      )}
      {balanceDisplay.reserved && balancesAll?.reservedBalance?.gtn(0) && (
        <>
          <Label label={t('reserved')} />
          <FormatBalance
            className='result'
            value={balancesAll.reservedBalance}
          />
        </>
      )}
      {balanceDisplay.bonded && (ownBonded.gtn(0) || otherBonded.length !== 0) && (
        <>
          <Label label={t('bonded')} />
          <FormatBalance
            className='result'
            value={ownBonded}
          >
            {otherBonded.length !== 0 && (
              <>&nbsp;(+{otherBonded.map((bonded, index): React.ReactNode =>
                <FormatBalance
                  key={index}
                  value={bonded}
                />
              )})</>
            )}
          </FormatBalance>
        </>
      )}
      {balanceDisplay.redeemable && stakingInfo?.redeemable?.gtn(0) && (
        <>
          <Label label={t('redeemable')} />
          <StakingRedeemable
            className='result'
            stakingInfo={stakingInfo}
          />
        </>
      )}
      {balanceDisplay.unlocking && stakingInfo?.unlocking && (
        <>
          <Label label={t('unbonding')} />
          <div className='result'>
            <StakingUnbonding stakingInfo={stakingInfo} />
          </div>
        </>
      )}
    </>
  );

  if (withBalanceToggle) {
    return (
      <>
        <Expander summary={<FormatBalance value={balancesAll?.votingBalance} />}>
          <div className='body column'>
            {allItems}
          </div>
        </Expander>
      </>
    );
  }

  return (
    <>
      {allItems}
    </>
  );
}

function AddressInfo (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const { children, className, extraInfo, withBalanceToggle, withHexSessionId } = props;

  return (
    <div className={`ui--AddressInfo ${className} ${withBalanceToggle ? 'ui--AddressInfo-expander' : ''}`}>
      <div className={`column ${withBalanceToggle ? 'column--expander' : ''}`}>
        {renderBalances(props, allAccounts, t)}
        {withHexSessionId && withHexSessionId[0] && (
          <>
            <Label label={t('session keys')} />
            <div className='result'>{withHexSessionId[0]}</div>
          </>
        )}
        {withHexSessionId && withHexSessionId[0] !== withHexSessionId[1] && (
          <>
            <Label label={t('session next')} />
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
      justify-content: center;
    }

    .column {
      justify-content: start;

      &.column--expander {
        width: 16.5rem;

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
        opacity: 1;

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

          .icon {
            margin-left: 0;
            margin-right: 0.25rem;
            padding-right: 0 !important;
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
    }]
  )
);
