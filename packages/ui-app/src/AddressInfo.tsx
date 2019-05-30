// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances } from '@polkadot/api-derive/types';
import { BareProps, I18nProps } from './types';

import React from 'react';
import styled from 'styled-components';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { formatBalance, formatNumber } from '@polkadot/util';

import translate from './translate';
import CryptoType from './CryptoType';
import Bonded from './Bonded';
import Label from './Label';
import Unlocking from './Unlocking';

type Props = BareProps & I18nProps & {
  balances_all?: DerivedBalances,
  children?: React.ReactNode,
  value: string,
  withBalance?: boolean | { available?: boolean, bonded?: boolean, free?: boolean, locked?: boolean },
  withExtended?: boolean | { crypto?: boolean, nonce?: boolean }
};

// <AddressInfo
//   withBalance // default
//   withExtended={true} // optional
//   value={address}
// >{children></AddressInfo>
//
// Additionally to tweak the display, i.e. only available
//
// <AddressInfo withBalance={{ available: true }} />
class AddressInfo extends React.PureComponent<Props> {
  render () {
    const { children, className } = this.props;

    return (
      <div className={className}>
        {this.renderBalances()}
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
    const { balances_all, t, value, withBalance = true } = this.props;
    const balanceDisplay = withBalance === true
      ? { available: true, bonded: true, free: true, locked: true }
      : withBalance
        ? withBalance
        : undefined;

    if (!balanceDisplay || !balances_all) {
      return null;
    }

    return (
      <div className='column'>
        {balanceDisplay.free && balances_all.freeBalance.gtn(-1) && (
          <>
            <Label label={t('total')} />
            <div className='result'>{formatBalance(balances_all.freeBalance)}</div>
          </>
        )}
        {balanceDisplay.available && balances_all.availableBalance.gtn(-1) && (
          <>
            <Label label={t('available')} />
            <div className='result'>{formatBalance(balances_all.availableBalance)}</div>
          </>
        )}
        {balanceDisplay.bonded && (
          <>
            <Label label={t('bonded')} />
            <Bonded
              className='result'
              params={value}
            />
          </>
        )}
        {balanceDisplay.locked && (
          <>
            <Label label={t('locked')} />
            <Unlocking
              className='result'
              params={value}
            />
          </>
        )}
      </div>
    );
  }

  private renderExtended () {
    const { balances_all, t, value, withExtended } = this.props;
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
        {extendedDisplay.nonce && balances_all.accountNonce.gtn(-1) && (
          <>
            <Label label={t('transactions')} />
            <div className='result'>{formatNumber(balances_all.accountNonce)}</div>
          </>
        )}
        {extendedDisplay.crypto && (
          <>
            <Label label={t('crypto type')} />
            <CryptoType
              accountId={value}
              className='result'
            />
          </>
        )}
      </div>
    );
  }
}

export default withMulti(
  styled(AddressInfo)`
    align-items: flex-start;
    display: flex;
    flex: 1;
    justify-content: center;

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
      }
    }
  `,
  translate,
  withCalls<Props>(
    ['derive.balances.all', { paramName: 'value' }]
  )
);
