// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxFees } from '@polkadot/api-observable/types';
import { QueueTx } from './types';
// TODO - reuse instead of obtaining from app-transfer
import { Fees } from '@polkadot/app-transfer/types';

import BN from 'bn.js';
import React from 'react';
import { Trans } from 'react-i18next';
import { Method } from '@polkadot/types';
import { Call, Modal } from '@polkadot/ui-app/index';
// TODO - reuse instead of obtaining from app-transfer
import FeeDisplay from '@polkadot/app-transfer/Fees';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withObservable from '@polkadot/ui-react-rx/with/observable';

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
    const amount = methodInstance.args[1].raw;
    const recipientId = methodInstance.args[0].raw.toString();

    const { method, section } = Method.findFunction(extrinsic.callIndex);

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
                fees={fees}
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
