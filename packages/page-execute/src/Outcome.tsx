// Copyright 2017-2020 @canvas-ui/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-components/types';
import { CallResult } from './types';

import React from 'react';
import styled from 'styled-components';
import { Button, IdentityIcon, MessageSignature, Output } from '@canvas-ui/react-components';
import { TypeRegistry } from '@polkadot/types';

interface Props extends BareProps {
  onClear?: () => void;
  outcome: CallResult;
  registry: TypeRegistry;
}

function Outcome ({ className, onClear, outcome: { from, message, output, params, result, when }, registry }: Props): React.ReactElement<Props> | null {
  return (
    <div className={className}>
      <div className='info'>
        <IdentityIcon value={from} />
        <MessageSignature
          message={message}
          params={params}
          registry={registry}
        />
        <span className='date-time'>
          {when.toLocaleDateString()}
          {' '}
          {when.toLocaleTimeString()}
        </span>
        <Button
          className='icon-button clear-btn'
          icon='close'
          isPrimary
          onClick={onClear}
          size='mini'
        />
      </div>
      <Output
        isError={!result.isOk}
        registry={registry}
        type={message.returnType}
        value={output}
        withCopy
        withLabel={false}
      />
    </div>
  );
}

export default React.memo(styled(Outcome)`
  & {
    .info {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem 0;

      & > *:not(:first-child) {
        padding-left: 1.5rem !important;
      }
    }

    .clear-btn {
      display: none;
      opacity: 0;
    }

    .date-time {
      color: #aaa;
      white-space: nowrap;
    }

    .origin {
      padding-left: 0 !important;

      * {
        margin-left: 0 !important;
      }
    }

    &:hover {
      .clear-btn {
        opacity: 1;
      }
    }
  }
`);
