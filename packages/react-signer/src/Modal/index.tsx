// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx } from '@polkadot/react-components/Status/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import TxSigned from './TxSigned';
import TxUnsigned from './TxUnsigned';

interface Props {
  className?: string;
  currentItem: QueueTx;
}

function SignerModal ({ className, currentItem }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [requestAddress, setRequestAddress] = useState<string | null>(null);

  useEffect((): void => {
    setRequestAddress(
      currentItem
        ? currentItem.accountId && !currentItem.isUnsigned
          ? currentItem.accountId
          : null
        : null
    );
  }, [currentItem]);

  return (
    <Modal
      className={className}
      header={t('Authorize transaction')}
      size='large'
    >
      {requestAddress
        ? (
          <TxSigned
            currentItem={currentItem}
            requestAddress={requestAddress}
          />
        )
        : (
          <TxUnsigned
            currentItem={currentItem}
          />
        )
      }
    </Modal>
  );
}

export default React.memo(styled(SignerModal)``);
