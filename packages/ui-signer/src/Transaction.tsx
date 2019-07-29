// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx } from '@polkadot/ui-app/Status/types';

import React from 'react';
import { GenericCall } from '@polkadot/types';
import { Call, InputAddress, Modal } from '@polkadot/ui-app';

import Checks from './Checks';
import translate from './translate';

interface Props extends I18nProps {
  children?: React.ReactNode;
  isSendable: boolean;
  value: QueueTx;
}

class Transaction extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { children, value: { extrinsic } } = this.props;

    if (!extrinsic) {
      return null;
    }

    const { meta, method, section } = GenericCall.findFunction(extrinsic.callIndex);

    return (
      <>
        <Modal.Header>
          {section}.{method}
          <label><details><summary>{
            meta && meta.documentation
              ? meta.documentation.join(' ')
              : ''
          }</summary></details></label>
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

  private renderAccount (): React.ReactNode {
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

  private renderChecks (): React.ReactNode {
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
