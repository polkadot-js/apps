// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React, { useContext } from 'react';
import styled from 'styled-components';
import { StatusContext } from '@polkadot/react-components';

import Modal from './Modal';

interface Props extends BareProps {
  children: React.ReactNode;
}

function Signer ({ children, className, style }: Props): React.ReactElement<Props> {
  const { queueSetTxStatus, txqueue } = useContext(StatusContext);

  return (
    <>
      {children}
      <Modal
        className={className}
        key='signer-modal'
        queue={txqueue}
        queueSetTxStatus={queueSetTxStatus}
        style={style}
      />
    </>
  );
}

export default React.memo(styled(Signer)`
  .ui--signer-Signer-Content {
    .modal-Text {
      margin-bottom: 1em;
      padding: 1em;
    }

    .expanded h3 {
      margin-bottom: 0.75rem;
    }

    .code {
      background: #f5f5f5;
      font-family: monospace;
      margin: 0 0.25em;
      overflow-wrap: break-word;
      padding: 0.25em 0.5em;
      word-break: break-all;
      word-break: break-word;
      word-wrap: break-word;
    }

    .hl {
      font-weight: 700;
    }

    .tipToggle {
      width: 100%;
      text-align: right;
    }

    .ui--Checks {
      margin-top: 0.75rem;
    }
  }

  .signToggle {
    position: absolute;
    left: 1.5rem;
  }
`);
