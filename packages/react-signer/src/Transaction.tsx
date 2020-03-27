// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx } from '@polkadot/react-components/Status/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { registry } from '@polkadot/react-api';
import { Call, InputAddress, Expander, Modal } from '@polkadot/react-components';

import Checks from './Checks';
import { useTranslation } from './translate';

interface Props {
  children?: React.ReactNode;
  className?: string;
  hideDetails?: boolean;
  isSendable: boolean;
  onError: () => void;
  tip?: BN;
  value: QueueTx;
}

function Transaction ({ children, className, hideDetails, isSendable, onError, value: { accountId, extrinsic, isUnsigned }, tip }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!extrinsic) {
    return null;
  }

  const { meta, method, section } = registry.findMetaCall(extrinsic.callIndex);

  return (
    <Modal.Content className={`ui--signer-Signer-Content ${className}`}>
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
          <Expander
            className='tx-details'
            summary={
              <>
                {t('Sending transaction')} <span className='highlight'>{section}.{method}({
                  meta?.args.map(({ name }) => name).join(', ') || ''
                })</span>
              </>
            }
            summaryMeta={meta}
          >
            <Call
              onError={onError}
              value={extrinsic}
              withBorder={false}
            />
          </Expander>
        </>
      )}
      {!hideDetails && !isUnsigned && (
        <Checks
          accountId={accountId}
          className='tx-details'
          extrinsic={extrinsic}
          isSendable={isSendable}
          tip={tip}
        />
      )}
      {children}
    </Modal.Content>
  );
}

export default React.memo(styled(Transaction)`
  .tx-details {
    margin-left: 2rem;

    .ui--Expander-summary {
      font-size: 1.1rem;
      margin: 0.5rem 0;
    }

    .highlight {
      font-weight: 600;
    }

    .meta {
      margin-bottom: 0.5rem;
      margin-left: 2rem;
    }

    .meta, .mute {
      opacity: 0.6;
    }
  }
`);
