/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import { ValidatorPrefs0to145 } from '@polkadot/types/interfaces';
import { BareProps, I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { formatBalance, formatNumber } from '@polkadot/util';
import { Icon, Tooltip, TxButton } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';

import CryptoType from './CryptoType';
import Label from './Label';
import translate from './translate';

// true to display, or (for bonded) provided values [own, ...all extras]
export interface BalanceActiveType {
  available?: boolean;
  bonded?: boolean | BN[];
  free?: boolean;
  redeemable?: boolean;
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
  balances_all?: DerivedBalances;
  children?: React.ReactNode;
  staking_info?: DerivedStaking;
  withBalance?: boolean | BalanceActiveType;
  withExtended?: boolean | CryptoActiveType;
  withHexSessionId: string | null;
  withRewardDestination?: boolean;
  withValidatorPrefs?: boolean | ValidatorPrefsType;
}

// either true (filtered above already) or [own, ...all extras bonded funds from nominators]
function renderBonded ({ staking_info, t }: Props, bonded: true | BN[]): React.ReactNode {
  let value;

  if (Array.isArray(bonded)) {
    // Get the sum of funds bonded by any nominator (if available)
    const extras = bonded.filter((_, index): boolean => index !== 0);
    const extra = extras.reduce((total, value): BN => total.add(value), new BN(0)).gtn(0)
      ? `(+${extras.map((bonded): string => formatBalance(bonded)).join(', ')})`
      : '';

    value = `${formatBalance(bonded[0])} ${extra}`;
  } else if (staking_info && staking_info.stakingLedger && staking_info.accountId.eq(staking_info.stashId)) {
    value = formatBalance(staking_info.stakingLedger.active);
  }

  return value
    ? (
      <>
        <Label label={t('bonded')} />
        <div className='result'>{value}</div>
      </>
    )
    : undefined;
}

function renderExtended ({ balances_all, t, address, withExtended }: Props): React.ReactNode {
  const extendedDisplay = withExtended === true
    ? { crypto: true, nonce: true }
    : withExtended || undefined;

  if (!extendedDisplay || !balances_all) {
    return null;
  }

  return (
    <div className='column'>
      {extendedDisplay.nonce && (
        <>
          <Label label={t('transactions')} />
          <div className='result'>{formatNumber(balances_all.accountNonce)}</div>
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

function renderUnlocking ({ staking_info, t }: Props): React.ReactNode {
  if (!staking_info || !staking_info.unlocking || !staking_info.unlocking.length) {
    return null;
  }

  const total = staking_info.unlocking.reduce((total, { value }): BN => total.add(value), new BN(0));

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
        text={
          <>
            {staking_info.unlocking.map(({ remainingBlocks, value }, index): React.ReactNode => (
              <div key={index}>
                {t('{{value}}, {{remaining}} blocks left', {
                  replace: {
                    remaining: formatNumber(remainingBlocks),
                    value: formatBalance(value)
                  }
                })}
              </div>
            ))}
          </>
        }
        trigger='unlocking-trigger'
      />
    </div>
  );
}

function renderValidatorPrefs ({ staking_info, t, withValidatorPrefs = false }: Props): React.ReactNode {
  const validatorPrefsDisplay = withValidatorPrefs === true
    ? { unstakeThreshold: true, validatorPayment: true }
    : withValidatorPrefs;

  if (!validatorPrefsDisplay || !staking_info || !staking_info.validatorPrefs) {
    return null;
  }

  // start with a spacer
  return (
    <>
      <div className='spacer'></div>
      {validatorPrefsDisplay.unstakeThreshold && (staking_info.validatorPrefs as ValidatorPrefs0to145).unstakeThreshold && (
        <>
          <Label label={t('unstake threshold')} />
          <div className='result'>
            {(staking_info.validatorPrefs as ValidatorPrefs0to145).unstakeThreshold.toString()}
          </div>
        </>
      )}
      {validatorPrefsDisplay.validatorPayment && staking_info.validatorPrefs.validatorPayment && (
        <>
          <Label label={t('commision')} />
          <div className='result'>{
            formatBalance(staking_info.validatorPrefs.validatorPayment)
          }</div>
        </>
      )}
    </>
  );
}

function renderBalances (props: Props): React.ReactNode {
  const { balances_all, staking_info, t, withBalance = true } = props;
  const balanceDisplay = withBalance === true
    ? { available: true, bonded: true, free: true, redeemable: true, unlocking: true }
    : withBalance || undefined;

  if (!balanceDisplay || !balances_all) {
    return null;
  }

  return (
    <>
      {balanceDisplay.free && (
        <>
          <Label label={t('total')} />
          <div className='result'>{formatBalance(balances_all.freeBalance)}</div>
        </>
      )}
      {balanceDisplay.available && (
        <>
          <Label label={t('available')} />
          <div className='result'>{formatBalance(balances_all.availableBalance)}</div>
        </>
      )}
      {balanceDisplay.bonded && renderBonded(props, balanceDisplay.bonded)}
      {balanceDisplay.redeemable && staking_info && staking_info.redeemable && staking_info.redeemable.gtn(0) && (
        <>
          <Label label={t('redeemable')} />
          <div className='result'>
            {formatBalance(staking_info.redeemable)}
            {staking_info.controllerId && (
              <TxButton
                accountId={staking_info.controllerId.toString()}
                className='iconButton'
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
      {balanceDisplay.unlocking && staking_info && staking_info.unlocking && (
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
  const { className, children, staking_info, t, withHexSessionId, withRewardDestination } = props;

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
        {withRewardDestination && staking_info && staking_info.rewardDestination && (
          <>
            <Label label={t('reward destination')} />
            <div className='result'>{staking_info.rewardDestination.toString().toLowerCase()}</div>
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

        button.ui.icon.primary.button.iconButton {
          background: white !important;
        }
      }

      .spacer {
        margin-top: 1rem;
      }
    }
  `,
  translate,
  withCalls<Props>(
    ['derive.balances.all', { paramName: 'address' }],
    ['derive.staking.info', { paramName: 'address' }]
  )
);
