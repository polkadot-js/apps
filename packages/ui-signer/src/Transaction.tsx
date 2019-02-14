// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx } from '@polkadot/ui-app/Status/types';

import React from 'react';
import { Method } from '@polkadot/types';
import { Call, InputAddress, Modal } from '@polkadot/ui-app/index';

import Checks from './Checks';
import translate from './translate';

type Props = I18nProps & {
  children?: React.ReactNode,
  isSendable: boolean,
  value: QueueTx
};

class Transaction extends React.PureComponent<Props> {
  render () {
    const { children, value: { extrinsic } } = this.props;

    if (!extrinsic) {
      return null;
    }

    const { meta, method, section } = Method.findFunction(extrinsic.callIndex);

    return (
      <>
        <Modal.Header>
          {section}.{method}
          <label>{
            meta && meta.documentation
              ? meta.documentation.join(' ')
              : ''
          }</label>
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          {this.renderAccount()}
          <Call value={extrinsic} />
          {this.renderChecks()}
          {children}
        </Modal.Content>
      </>
    );
  }

  private renderAccount () {
    const { t, value: { accountId, isUnsigned } } = this.props;

    if (isUnsigned || !accountId) {
      return null;
    }

    return (
      <InputAddress
        className='full'
        defaultValue={accountId}
        isDisabled
        isInput
        label={t('sending from my account')}
        withLabel
      />
    );
  }

  private renderChecks () {
    const { isSendable, value: { accountId, extrinsic, isUnsigned } } = this.props;

    if (isUnsigned) {
      return null;
    }

    return (
      <Checks
        accountId={accountId}
        extrinsic={extrinsic}
        isSendable={isSendable}
      />
    );
  }
}

export default translate(Transaction);
