// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx } from '@polkadot/react-components/Status/types';

import BN from 'bn.js';
import React from 'react';
import { registry } from '@polkadot/react-api';
import { Call, InputAddress, Modal } from '@polkadot/react-components';

import Checks from './Checks';
import { useTranslation } from './translate';

interface Props {
  children?: React.ReactNode;
  hideDetails?: boolean;
  isSendable: boolean;
  onError: () => void;
  tip?: BN;
  value: QueueTx;
}

export default function Transaction ({ children, hideDetails, isSendable, onError, value: { accountId, extrinsic, isUnsigned }, tip }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!extrinsic) {
    return null;
  }

  const { meta, method, section } = registry.findMetaCall(extrinsic.callIndex);

  return (
    <>
      <Modal.Header>
        {section}.{method}
        <label><details><summary>{meta?.documentation.join(' ') || t('Details')}</summary></details></label>
      </Modal.Header>
      <Modal.Content className='ui--signer-Signer-Content'>
        {!hideDetails && (
          <>
            {!isUnsigned && accountId && (
              <InputAddress
                className='full'
                defaultValue={accountId}
                isDisabled
                isInput
                label={t('sending from my account')}
                withLabel
              />
            )}
            <Call
              onError={onError}
              value={extrinsic}
            />
          </>
        )}
        {children}
        {!hideDetails && !isUnsigned && (
          <Checks
            accountId={accountId}
            extrinsic={extrinsic}
            isSendable={isSendable}
            tip={tip}
          />
        )}
      </Modal.Content>
    </>
  );
}
