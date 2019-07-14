// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import { BareProps, I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { formatBalance, formatNumber } from '@polkadot/util';
import { Icon, Tooltip, TxButton } from '@polkadot/ui-app';
import { withCalls, withMulti } from '@polkadot/ui-api';

import CryptoType from './CryptoType';
import Label from './Label';
import translate from './translate';

// true to display, or (for bonded) provided values [own, ...all extras]
export type BalanceActiveType = {
  available?: boolean,
  bonded?: boolean | BN[],
  free?: boolean,
  redeemable?: boolean,
  unlocking?: boolean
};

export type CryptoActiveType = {
  crypto?: boolean,
  nonce?: boolean
};

export type ValidatorPrefsType = {
  unstakeThreshold?: boolean,
  validatorPayment?: boolean
};

type Props = BareProps & I18nProps & {
  address: string,
  balances_all?: DerivedBalances,
  children?: React.ReactNode,
  staking_info?: DerivedStaking,
  withBalance?: boolean | BalanceActiveType,
  withRewardDestination?: boolean,
  withExtended?: boolean | CryptoActiveType,
  withValidatorPrefs?: boolean | ValidatorPrefsType
};

class AddressInfo extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { children, className } = this.props;

    return (
      <div className={className}>
        <div className='column'>
          {this.renderBalances()}
          {this.renderValidatorPrefs()}
          {this.renderRewardDestination()}
        </div>

        {this.renderExtended()}
        {children && (
          <div className='column'>
            {children}
          </div>
        )}
      </div>
    );
  }

  private renderBalances () {
    const { balances_all, staking_info, t, withBalance = true } = this.props;
    const balanceDisplay = withBalance === true
      ? { available: true, bonded: true, free: true, redeemable: true, unlocking: true }
      : withBalance
        ? withBalance
        : undefined;

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
        {balanceDisplay.bonded && this.renderBonded(balanceDisplay.bonded)}
        {balanceDisplay.redeemable && staking_info && staking_info.redeemable && staking_info.redeemable.gtn(0) && (
          <>
            <Label label={t('redeemable')} />
            <div className='result'>
              {formatBalance(staking_info.redeemable)}
              {this.renderRedeemButton()}
            </div>
          </>
        )}
        {balanceDisplay.unlocking && staking_info && staking_info.unlocking && (
          <>
            <Label label={t('unbonding')} />
            <div className='result'>
              {this.renderUnlocking()}
            </div>
          </>
        )}
    </>
    );
  }

  // either true (filtered above already) or [own, ...all extras bonded funds from nominators]
  private renderBonded (bonded: true | BN[]) {
    const { staking_info, t } = this.props;
    let value = undefined;

    if (Array.isArray(bonded)) {
      // Get the sum of funds bonded by any nominator (if available)
      const extras = bonded.filter((value, index) => index !== 0);
      const extra = extras.reduce((total, value) => total.add(value), new BN(0)).gtn(0)
        ? `(+${extras.map((bonded) => formatBalance(bonded)).join(', ')})`
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

  private renderExtended () {
    const { balances_all, t, address, withExtended } = this.props;
    const extendedDisplay = withExtended === true
      ? { crypto: true, nonce: true }
      : withExtended
        ? withExtended
        : undefined;

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
            <Label label={t('crypto type')} />
            <CryptoType
              accountId={address}
              className='result'
            />
          </>
        )}
      </div>
    );
  }

  private renderRewardDestination () {
    const { staking_info, withRewardDestination, t } = this.props;

    if (!withRewardDestination) {
      return null;
    }

    return (
      staking_info &&
      staking_info.rewardDestination &&
      <>
        <Label label={t('reward destination')} />
        <div className='result'>{staking_info.rewardDestination.toString().toLowerCase()}</div>
      </>
    );
  }

  private renderRedeemButton () {
    const { staking_info, t } = this.props;

    return (staking_info && staking_info.controllerId && (
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
    ));
  }

  private renderUnlocking () {
    const { staking_info, t } = this.props;

    return (
      staking_info &&
      staking_info.unlocking &&
      staking_info.unlocking.map(({ remainingBlocks, value }, index) => (
        <div key={index}>
          {formatBalance(value)}
          <Icon
            name='info circle'
            data-tip
            data-for={`unlocking-trigger-${index}`}
          />
          <Tooltip
            text={t('{{remainingBlocks}} blocks left', { replace: { remainingBlocks } })}
            trigger={`unlocking-trigger-${index}`}
          />
        </div>
      ))
    );
  }

  private renderValidatorPrefs () {
    const { staking_info, t, withValidatorPrefs = false } = this.props;
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
        {validatorPrefsDisplay.unstakeThreshold && staking_info.validatorPrefs.unstakeThreshold && (
          <>
            <Label label={t('unstake threshold')} />
            <div className='result'>{staking_info.validatorPrefs.unstakeThreshold.toString()}
            </div>
          </>
        )}
        {validatorPrefsDisplay.validatorPayment && staking_info.validatorPrefs.validatorPayment && (
          <>
            <Label label={t('commision')} />
            <div className='result'>{formatBalance(staking_info.validatorPrefs.validatorPayment.toBn())}
            </div>
          </>
        )}
      </>
    );
  }
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
