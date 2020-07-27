// Copyright 2017-2020 @canvas-ui/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps as Props } from '@canvas-ui/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { Modal } from '@canvas-ui/react-components';

import { useTranslation } from './translate';
import TxSigned from './TxSigned';
import TxUnsigned from './TxUnsigned';
import usePendingTx from './usePendingTx';

function Signer ({ children, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { currentItem, requestAddress } = usePendingTx();

  return (
    <>
      {children}
      {currentItem && (
        <Modal
          className={className}
          header={t<string>('Authorize transaction')}
          size='large'
        >
          {currentItem.isUnsigned
            ? <TxUnsigned currentItem={currentItem} />
            : (
              <TxSigned
                currentItem={currentItem}
                requestAddress={requestAddress}
              />
            )
          }
        </Modal>
      )}
    </>
  );
}

export default React.memo(styled(Signer)`
  .signToggle {
    position: absolute;
    left: 1.5rem;
  }
`);
