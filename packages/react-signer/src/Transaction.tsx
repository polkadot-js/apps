// Copyright 2017-2022 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueTx } from '@polkadot/react-components/Status/types';
import type { BN } from '@polkadot/util';

import React from 'react';
import styled from 'styled-components';

import { Call, Expander, Modal } from '@polkadot/react-components';

import PaymentInfo from './PaymentInfo';
import { useTranslation } from './translate';

interface Props {
  accountId: string | null;
  className?: string;
  currentItem: QueueTx;
  isSendable: boolean;
  onError: () => void;
  tip?: BN;
}

function Transaction ({ accountId, className, currentItem: { extrinsic, isUnsigned, payload }, isSendable, onError, tip }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!extrinsic) {
    return null;
  }

  const { meta, method, section } = extrinsic.registry.findMetaCall(extrinsic.callIndex);
  const args = meta?.args.map(({ name }) => name).join(', ') || '';

  return (
    <Modal.Columns
      className={className}
      hint={t<string>('The details of the transaction including the type, the description (as available from the chain metadata) as well as any parameters and fee estimations (as available) for the specific type of call.')}
    >
      <Expander
        className='tx-details'
        summary={<>{t<string>('Sending transaction')} <span className='highlight'>{section}.{method}({args})</span></>}
        summaryMeta={meta}
      >
        <Call
          onError={onError}
          value={extrinsic}
          withBorder={false}
        />
      </Expander>
      {!isUnsigned && !payload && (
        <PaymentInfo
          accountId={accountId}
          className='tx-details'
          extrinsic={extrinsic}
          isSendable={isSendable}
          tip={tip}
        />
      )}
    </Modal.Columns>
  );
}

export default React.memo(styled(Transaction)`
  .tx-details {
    .ui--Expander-summary {
      font-size: 1.1rem;
      margin: 0 0 0.5rem;
    }

    .highlight {
      font-weight: var(--font-weight-normal);
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
