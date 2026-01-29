// Copyright 2017-2025 @polkadot/app-rpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueTx } from '@polkadot/react-components/Status/types';

import React from 'react';

import { Output, styled } from '@polkadot/react-components';
import valueToText from '@polkadot/react-params/valueToText';
import { isUndefined } from '@polkadot/util';

interface Props {
  queue: QueueTx[];
}

function Results ({ queue = [] }: Props): React.ReactElement<Props> | null {
  const filtered = queue
    .filter(({ error, result }) => !isUndefined(error) || !isUndefined(result))
    .reverse();

  if (!filtered.length) {
    return null;
  }

  return (
    <StyledSection className='rpc--Results'>
      {filtered.map(({ error, id, result, rpc: { method, section, type } }): React.ReactNode => (
        <Output
          isError={!!error}
          key={id}
          label={`${id}: ${section}.${method}: ${type}`}
          value={
            error
              ? error.message
              : <pre>{valueToText('', result as null)}</pre>
          }
        />
      ))}
    </StyledSection>
  );
}

const StyledSection = styled.section`
  .ui--Output > label {
    text-transform: none;
  }
`;

export default React.memo(Results);
