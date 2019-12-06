// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import { ValidatorPrefsTo145 } from '@polkadot/types/interfaces';
import { BareProps, I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { formatBalance, formatNumber, isObject } from '@polkadot/util';
import { Icon, Tooltip, TxButton } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';
import { useAccounts } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import CryptoType from './CryptoType';
import Label from './Label';
import translate from './translate';

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

const PERBILL = new BN(1000000000);

interface Props extends BareProps, I18nProps {
  address: string;
  balancesAll?: DerivedBalances;
  children?: React.ReactNode;
  extraInfo?: [string, string][];
  stakingInfo?: DerivedStaking;
  withBalance?: boolean | BalanceActiveType;
  withBalanceToggle?: false;
  withExtended?: boolean | CryptoActiveType;
  withHexSessionId?: (string | null)[];
  withRewardDestination?: boolean;
  withValidatorPrefs?: boolean | ValidatorPrefsType;
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

function skipStakingIf ({ stakingInfo, withBalance = true, withRewardDestination = false, withValidatorPrefs = false }: Props): boolean {
  if (stakingInfo) {
    return true;
  } else if (withBalance === true || withValidatorPrefs || withRewardDestination) {
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
function calcBonded (stakingInfo?: DerivedStaking, bonded?: boolean | BN[]): [BN, BN[]] {
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

function renderExtended ({ balancesAll, t, address, withExtended }: Props): React.ReactNode {
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

function renderUnlocking ({ stakingInfo, t }: Props): React.ReactNode {
  if (!stakingInfo || !stakingInfo.unlocking || !stakingInfo.unlocking.length) {
    return null;
  }

  const total = stakingInfo.unlocking.reduce((total, { value }): BN => total.add(value), new BN(0));

  if (total.eqn(0)) {
    return null;
  }

  return (
    <div>
      <FormatBalance value={total} />
      <Icon
        name='info circle'
        data-tip
        data-for='unlocking-trigger'
      />
      <Tooltip
        text={stakingInfo.unlocking.map(({ remainingBlocks, value }, index): React.ReactNode => (
          <div key={index}>
            {t('{{value}}, {{remaining}} blocks left', {
              replace: {
                remaining: formatNumber(remainingBlocks),
                value: formatBalance(value, { forceUnit: '-' })
              }
            })}
          </div>
        ))}
        trigger='unlocking-trigger'
      />
    </div>
  );
}

function renderValidatorPrefs ({ stakingInfo, t, withValidatorPrefs = false }: Props): React.ReactNode {
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
              <span>{(stakingInfo.validatorPrefs.commission.unwrap().muln(10000).div(PERBILL).toNumber() / 100).toFixed(2)}%</span>
            </>
          )
      )}
    </>
  );
}

function renderBalances (props: Props, allAccounts: string[]): React.ReactNode {
  const { balancesAll, stakingInfo, t, withBalance = true, withBalanceToggle = false } = props;
  const balanceDisplay = withBalance === true
    ? DEFAULT_BALANCES
    : withBalance || false;

  if (!balanceDisplay) {
    return null;
  }

  const [ownBonded, otherBonded] = calcBonded(stakingInfo, balanceDisplay.bonded);
  const controllerId = stakingInfo?.controllerId?.toString();

  const allItems = (
    <>
      {balancesAll && balanceDisplay.total && (
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
      {balanceDisplay.locked && balancesAll?.lockedBalance?.gtn(0) && (
        <>
          <Label label={t('locked')} />
          <FormatBalance
            className='result'
            value={balancesAll.lockedBalance}
          />
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
                <FormatBalance key={index} value={bonded} />
              )})</>
            )}
          </FormatBalance>
        </>
      )}
      {balanceDisplay.redeemable && stakingInfo?.redeemable?.gtn(0) && (
        <>
          <Label label={t('redeemable')} />
          <FormatBalance
            className='result'
            value={stakingInfo.redeemable}
          >
            {controllerId && allAccounts.includes(controllerId) && (
              <TxButton
                accountId={controllerId}
                className='icon-button'
                icon='lock'
                size='small'
                isPrimary
                key='unlock'
                params={[]}
                tooltip={t('Redeem these funds')}
                tx='staking.withdrawUnbonded'
              />
            )}
          </FormatBalance>
        </>
      )}
      {balanceDisplay.unlocking && stakingInfo?.unlocking && (
        <>
          <Label label={t('unbonding')} />
          <div className='result'>
            {renderUnlocking(props)}
          </div>
        </>
      )}
    </>
  );

  if (withBalanceToggle) {
    return (
      <>
        <label>{t('balances')}</label>
        <details>
          <summary>
            <div className='body'>
              <FormatBalance value={balancesAll?.votingBalance} />
            </div>
          </summary>
          <div className='body column'>
            {allItems}
          </div>
        </details>
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
  const { allAccounts } = useAccounts();
  const { className, children, extraInfo, stakingInfo, t, withBalanceToggle, withHexSessionId, withRewardDestination } = props;

  return (
    <div className={`ui--AddressInfo ${className} ${withBalanceToggle ? 'ui--AddressInfo-expander' : ''}`}>
      <div className={`column ${withBalanceToggle ? 'column--expander' : ''}`}>
        {renderBalances(props, allAccounts)}
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
        {renderValidatorPrefs(props)}
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
        {withRewardDestination && stakingInfo && stakingInfo.rewardDestination && (
          <>
            <Label label={t('reward destination')} />
            <div className='result'>{stakingInfo.rewardDestination.toString().toLowerCase()}</div>
          </>
        )}
      </div>
      {renderExtended(props)}
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
      &.column--expander {
        text-align: left;
        width: 15rem;

        details[open] summary {
          .body {
            opacity: 0;
          }
        }

        details summary {
          width: 100%;

          .body {
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
            margin-left: .3em;
            margin-right: 0;
            padding-right: 0 !important;
          }

          button.ui.icon.primary.button.icon-button {
            background: white !important;
          }
        }
      }
    }
  `,
  translate,
  withCalls<Props>(
    ['derive.balances.all', {
      paramName: 'address',
      propName: 'balancesAll',
      skipIf: skipBalancesIf
    }],
    ['derive.staking.info', {
      paramName: 'address',
      propName: 'stakingInfo',
      skipIf: skipStakingIf
    }]
  )
);
