// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import { ValidatorPrefs0to145 } from '@polkadot/types/interfaces';
import { BareProps, I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { formatBalance, formatNumber, isObject } from '@polkadot/util';
import { Icon, Tooltip, TxButton } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';

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
}

export interface CryptoActiveType {
  crypto?: boolean;
  nonce?: boolean;
}

export interface ValidatorPrefsType {
  unstakeThreshold?: boolean;
  validatorPayment?: boolean;
}

interface Props extends BareProps, I18nProps {
  address: string;
  balancesAll?: DerivedBalances;
  children?: React.ReactNode;
  extraInfo?: [string, string][];
  stakingInfo?: DerivedStaking;
  withBalance?: boolean | BalanceActiveType;
  withExtended?: boolean | CryptoActiveType;
  withHexSessionId: string | null;
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
  unlocking: true
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
    if (withBalance.available || withBalance.locked || withBalance.reserved || withBalance.total) {
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
      {formatBalance(total)}
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
                value: formatBalance(value)
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
      {validatorPrefsDisplay.unstakeThreshold && (stakingInfo.validatorPrefs as ValidatorPrefs0to145).unstakeThreshold && (
        <>
          <Label label={t('unstake threshold')} />
          <div className='result'>
            {(stakingInfo.validatorPrefs as ValidatorPrefs0to145).unstakeThreshold.toString()}
          </div>
        </>
      )}
      {validatorPrefsDisplay.validatorPayment && stakingInfo.validatorPrefs.validatorPayment && (
        <>
          <Label label={t('commission')} />
          <div className='result'>{
            formatBalance(stakingInfo.validatorPrefs.validatorPayment)
          }</div>
        </>
      )}
    </>
  );
}

function renderBalances (props: Props): React.ReactNode {
  const { balancesAll, stakingInfo, t, withBalance = true } = props;
  const balanceDisplay = withBalance === true
    ? DEFAULT_BALANCES
    : withBalance || false;

  if (!balanceDisplay) {
    return null;
  }

  const [ownBonded, otherBonded] = calcBonded(stakingInfo, balanceDisplay.bonded);

  return (
    <>
      {balancesAll && balanceDisplay.total && (
        <>
          <Label label={t('total')} />
          <div className='result'>{formatBalance(balancesAll.votingBalance)}</div>
        </>
      )}
      {balancesAll && balanceDisplay.available && (
        <>
          <Label label={t('transferrable')} />
          <div className='result'>{formatBalance(balancesAll.availableBalance)}</div>
        </>
      )}
      {balancesAll && balanceDisplay.locked && balancesAll.lockedBalance && balancesAll.lockedBalance.gtn(0) && (
        <>
          <Label label={t('locked')} />
          <div className='result'>{formatBalance(balancesAll.lockedBalance)}</div>
        </>
      )}
      {balancesAll && balanceDisplay.reserved && balancesAll.reservedBalance && balancesAll.reservedBalance.gtn(0) && (
        <>
          <Label label={t('reserved')} />
          <div className='result'>{formatBalance(balancesAll.reservedBalance)}</div>
        </>
      )}
      {balanceDisplay.bonded && (ownBonded.gtn(0) || otherBonded.length !== 0) && (
        <>
          <Label label={t('bonded')} />
          <div className='result'>{formatBalance(ownBonded)}{otherBonded.length !== 0 && (
            ` (+${otherBonded.map((bonded): string => formatBalance(bonded)).join(', ')})`
          )}</div>
        </>
      )}
      {balanceDisplay.redeemable && stakingInfo && stakingInfo.redeemable && stakingInfo.redeemable.gtn(0) && (
        <>
          <Label label={t('redeemable')} />
          <div className='result'>
            {formatBalance(stakingInfo.redeemable)}
            {stakingInfo.controllerId && (
              <TxButton
                accountId={stakingInfo.controllerId.toString()}
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
          </div>
        </>
      )}
      {balanceDisplay.unlocking && stakingInfo && stakingInfo.unlocking && (
        <>
          <Label label={t('unbonding')} />
          <div className='result'>
            {renderUnlocking(props)}
          </div>
        </>
      )}
    </>
  );
}

function AddressInfo (props: Props): React.ReactElement<Props> {
  const { className, children, extraInfo, stakingInfo, t, withHexSessionId, withRewardDestination } = props;

  return (
    <div className={className}>
      <div className='column'>
        {renderBalances(props)}
        {withHexSessionId && (
          <>
            <Label label={t('session keys')} />
            <div className='result'>{withHexSessionId}</div>
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
    justify-content: center;
    white-space: nowrap;

    .column {
      flex: 1;
      display: grid;
      opacity: 1;

      label {
        grid-column:  1;
        padding-right: 0.5rem;
        text-align: right;

        .help.circle.icon {
          display: none;
        }
      }

      .result {
        grid-column:  2;

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
