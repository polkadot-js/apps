// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { QueueTx } from '@polkadot/react-components/Status/types';

import React from 'react';
import { GenericCall } from '@polkadot/types';
import { Call, InputAddress, Modal } from '@polkadot/react-components';

import Checks from './Checks';
import translate from './translate';

interface Props extends I18nProps {
  children?: React.ReactNode;
  isSendable: boolean;
  value: QueueTx;
}

function renderAccount ({ t, value: { accountId, isUnsigned } }: Props): React.ReactNode {
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

function renderChecks ({ isSendable, value: { accountId, extrinsic, isUnsigned } }: Props): React.ReactNode {
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

function Transaction (props: Props): React.ReactElement<Props> | null {
  const { children, value: { extrinsic } } = props;

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
        {renderAccount(props)}
        <Call value={extrinsic} />
        {renderChecks(props)}
        {children}
      </Modal.Content>
    </>
  );
}

export default translate(Transaction);
