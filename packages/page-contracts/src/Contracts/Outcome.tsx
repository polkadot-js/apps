// Copyright 2017-2021 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CallResult } from './types';

import React from 'react';
import styled from 'styled-components';

import { Button, IdentityIcon, Output } from '@polkadot/react-components';
import valueToText from '@polkadot/react-params/valueToText';

import MessageSignature from '../shared/MessageSignature';

interface Props {
  className?: string;
  onClear?: () => void;
  outcome: CallResult;
}

function Outcome ({ className = '', onClear, outcome: { from, message, output, params, result, when } }: Props): React.ReactElement<Props> | null {
  return (
    <div className={className}>
      <IdentityIcon value={from} />
      <Output
        className='output'
        isError={!result.isOk}
        isFull
        label={
          <MessageSignature
            message={message}
            params={params}
          />
        }
        labelExtra={
          <span className='date-time'>
            {when.toLocaleDateString()}
            {' '}
            {when.toLocaleTimeString()}
          </span>
        }
        value={valueToText('Text', result.isOk ? output : result)}
      />
      <Button
        icon='times'
        onClick={onClear}
      />
    </div>
  );
}

export default React.memo(styled(Outcome)`
  align-items: center;
  display: flex;

  .output {
    flex: 1 1;
    margin: 0.25rem 0.5rem;
  }
`);
