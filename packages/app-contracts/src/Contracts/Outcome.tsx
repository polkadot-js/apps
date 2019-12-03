// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractCallOutcome } from '@polkadot/api-contract/types';

import React from 'react';
import styled from 'styled-components';
import { AddressMini, Button, MessageSignature, Output } from '@polkadot/react-components';

interface Props {
  className?: string;
  onClear?: () => void;
  outcome: ContractCallOutcome;
}

function Outcome (props: Props): React.ReactElement<Props> | null {
  const { className, onClear, outcome: { message, origin, output, params, isSuccess, time } } = props;
  const dateTime = new Date(time);

  return (
    <div className={className}>
      <div className='info'>
        <AddressMini
          className='origin'
          value={origin}
          withAddress={false}
          isPadded={false}
        />
        <MessageSignature
          message={message}
          params={params}
        />
        <span className='date-time'>
          {dateTime.toLocaleDateString()}
          {' '}
          {dateTime.toLocaleTimeString()}
        </span>
        <Button
          className='icon-button clear-btn'
          icon='close'
          size='mini'
          isPrimary
          onClick={onClear}
        />
      </div>
      <Output
        isError={!isSuccess}
        className='output'
        value={(output || '()').toString()}
        withCopy
        withLabel={false}
      />
    </div>
  );
}

export default styled(Outcome)`
  & {
    .info {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;

      & > *:not(:first-child) {
        padding-left: 1.5rem !important;
      }
    }

    .clear-btn {
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

    .output {
      font-family: monospace;
      margin-left: 3.5rem;

      .ui--output {
        border-color: #aaa;
        margin: 0;
      }
    }

    &:hover {
      .clear-btn {
        opacity: 1;
      }
    }
  }
`;
