// Copyright 2017-2025 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueTx } from '@polkadot/react-components/Status/types';
import type { BN } from '@polkadot/util';
import type { ExtendedSignerOptions } from './types.js';

import React from 'react';

import { Modal, styled } from '@polkadot/react-components';
import { CallExpander } from '@polkadot/react-params';

import PaymentInfo from './PaymentInfo.js';
import { useTranslation } from './translate.js';

interface Props {
  accountId?: string | null;
  className?: string;
  currentItem: QueueTx;
  onError: () => void;
  tip?: BN;
  signerOptions?: ExtendedSignerOptions;
}

function Transaction ({ accountId, className, currentItem: { extrinsic, isUnsigned, payload }, onError, signerOptions, tip }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!extrinsic) {
    return null;
  }

  return (
    <StyledModalColumns
      className={className}
      hint={t('The details of the transaction including the type, the description (as available from the chain metadata) as well as any parameters and fee estimations (as available) for the specific type of call.')}
    >
      <CallExpander
        isHeader
        onError={onError}
        value={extrinsic}
      />
      {!isUnsigned && !payload && (
        <PaymentInfo
          accountId={accountId}
          className='paymentInfo'
          extrinsic={extrinsic}
          isHeader
          signerOptions={signerOptions}
          tip={tip}
        />
      )}
    </StyledModalColumns>
  );
}

const StyledModalColumns = styled(Modal.Columns)`
  .paymentInfo {
    margin-top: 0.5rem;
  }
`;

export default React.memo(Transaction);
