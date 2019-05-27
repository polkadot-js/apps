// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, I18nProps } from './types';

import React from 'react';
import styled from 'styled-components';

import translate from './translate';
import CryptoType from './CryptoType';
import Available from './Available';
import Balance from './Balance';
import Bonded from './Bonded';
import Label from './Label';
import Nonce from './Nonce';
import Unlocking from './Unlocking';

type Props = BareProps & I18nProps & {
  children?: React.ReactNode,
  value: string,
  withBalance?: boolean,
  withExtended?: boolean
};

class AddressInfo extends React.PureComponent<Props> {
  render () {
    const { children, className, t, value, withBalance = true, withExtended } = this.props;

    return (
      <div className={className}>
        {withBalance && (
          <div className='column'>
            <Label
              help={t('overall amount of funds (be they vested, available for transfer or locked)')}
              label={t('total')}
            />
            <Balance
              className='result'
              params={value}
            />
            <Label
              help={t('funds that that can be transfered or bonded')}
              label={t('available')}
            />
            <Available
              className='result'
              params={value}
            />
            <Label
              help={t('funds bonded for validating or nominating. They are locked and cannot be transfered')}
              label={t('bonded')}
            />
            <Bonded
              className='result'
              params={value}
            />
            <Label
              help={t('the funds that are being unlocked or available for withdrawal')}
              label={t('locked')}
            />
            <Unlocking
              className='accounts--Account-balances-unlocking'
              params={value}
            />
          </div>
        )}
        {withExtended && (
          <div className='column'>
            <Label
              help={t('number of transactions made from this account')}
              label={t('transactions')}
            />
            <Nonce
              className='result'
              params={value}
            />
            <Label
              help={t('cryptographic curve chosen for this account upon creation')}
              label={t('crypto type')}
            />
            <CryptoType
              accountId={value}
              className='result'
            />
          </div>
        )}
        {children && (
          <div className='column'>
            {children}
          </div>
        )}
      </div>
    );
  }
}

export default translate(styled(AddressInfo)`
  align-items: flex-start;
  display: flex;
  flex: 1;
  justify-content: center;
  padding-top: 1rem;

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
`);
