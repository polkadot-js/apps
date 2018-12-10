// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx } from '@polkadot/ui-app/Status/types';
import { Fees } from '@polkadot/ui-app/Fees/types';
import { RxFees } from '@polkadot/api-observable/types';

import BN from 'bn.js';
import React from 'react';
import { Trans } from 'react-i18next';
import { Balance, Method } from '@polkadot/types';
import { Call, IdentityIcon, Modal } from '@polkadot/ui-app/index';
import { ZERO } from '@polkadot/ui-app/constants';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withObservable from '@polkadot/ui-react-rx/with/observable';

import FeeDisplay from './Fees';
import translate from './translate';

type Props = I18nProps & {
  children?: React.ReactNode,
  onChangeFees: (hasAvailable: boolean) => void,
  value: QueueTx,
  fees: RxFees
};

class Transaction extends React.PureComponent<Props> {
  render () {
    const { children, fees, style, t, value: { accountId, accountNonce, extrinsic } } = this.props;

    const nonce = accountNonce
      ? accountNonce
      : new BN(0);

    if (!extrinsic) {
      return null;
    }

    const methodInstance = new Method(extrinsic, extrinsic.meta);
    // Extrinsics do not always contain a recipient or an amount (i.e. setCode)
    let amount = ZERO;
    let recipientId = null;

    try {
      // @ts-ignore .get is valid
      amount = methodInstance.get('args').get('value').toBn();
    } catch (error) {
      console.info('Extrinsic submitted does not have an amount');
    }

    try {
      // @ts-ignore .get is valid
      recipientId = methodInstance.get('args').get('dest').toString();
    } catch (error) {
      console.info('Extrinsic submitted does not have a recipient');
    }

    const { method, section } = Method.findFunction(extrinsic.callIndex);
    const isTransfer = fees && fees.transferFee && section === 'balances' && method === 'transfer';

    let feesFiltered = fees;

    // Remove the transfer fee from extrinsics that are not transfers
    if (feesFiltered && !isTransfer) {
      feesFiltered.transferFee = new Balance(0);
    }

    return [
      <Modal.Header key='header'>
        {t('extrinsic.header', {
          defaultValue: 'Submit Transaction'
        })}
      </Modal.Header>,
      <Modal.Content className='ui--signer-Signer-Content' key='content'>
        <div className='ui--signer-Signer-Decoded'>
          <div className='expanded'>
            <p>
              <Trans i18nKey='decoded.short'>
                You are about to sign a message from <span className='code'>{accountId}</span> calling <span className='code'>{section}.{method}</span> with an index of <span className='code'>{nonce.toString()}</span>
              </Trans>
            </p>
            <Call value={extrinsic}/>
            <div
              className={'ui--signer-Signer-FeeDisplay'}
              style={style}
            >
              <FeeDisplay
                className='medium'
                accountId={accountId}
                amount={amount}
                fees={feesFiltered}
                recipientId={recipientId}
                onChange={this.onChangeFees}
              />
            </div>
          </div>
          <IdentityIcon
            className='icon'
            value={accountId}
          />
        </div>
        {children}
      </Modal.Content>
    ];
  }

  private onChangeFees = (fees: Fees) => {
    const { onChangeFees } = this.props;

    onChangeFees(fees.hasAvailable);
  }
}

export default withMulti(
  translate(Transaction),
  withObservable('fees', { propName: 'fees' })
);
