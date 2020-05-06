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

function Transaction ({ children, className, hideDetails, isSendable, onError, tip, value: { accountId, extrinsic, isUnsigned } }: Props): React.ReactElement<Props> | null {
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
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  className='full'
                  defaultValue={accountId}
                  isDisabled
                  isInput
                  label={t('sending from my account')}
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t('The sending account that will be used to send this transaction. Any applicable fees will be paid by this account.')}</p>
              </Modal.Column>
            </Modal.Columns>
          )}
          <Modal.Columns>
            <Modal.Column>
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
              {!isUnsigned && (
                <Checks
                  accountId={accountId}
                  className='tx-details'
                  extrinsic={extrinsic}
                  isSendable={isSendable}
                  tip={tip}
                />
              )}
            </Modal.Column>
            <Modal.Column>
              <p>{t('The details of the transaction including the type, the description (as available from the chain metadata) as well as any parameters and fee estimations (as available) for the specific type of call.')}</p>
            </Modal.Column>
          </Modal.Columns>
        </>
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
