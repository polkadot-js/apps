// Copyright 2017-2022 @polkadot/app-runtime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Result } from './types';

import React from 'react';

import { Output } from '@polkadot/react-components';
import valueToText from '@polkadot/react-params/valueToText';

interface Props {
  results: Result[];
}

function Results ({ results }: Props): React.ReactElement<Props> | null {
  if (!results.length) {
    return null;
  }

  return (
    <section className='runtime--Results'>
      {results.map(({ def: { method, section, type }, error, id, result }): React.ReactNode => (
        <Output
          isError={!!error}
          key={id}
          label={`${id}: ${section}.${method}: ${type}`}
          value={
            error
              ? error.message
              : <pre>{valueToText('', result)}</pre>
          }
        />
      ))}
    </section>
  );
}

export default React.memo(Results);
