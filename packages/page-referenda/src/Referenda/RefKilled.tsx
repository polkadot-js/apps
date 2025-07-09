// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReferendumProps as Props } from '../types.js';

import React, { useMemo } from 'react';

import RefEnd from './RefEnd.js';

function RefOther ({ value: { info } }: Props): React.ReactElement<Props> {
  const when = useMemo(
    () => info.isKilled
      ? info.asKilled
      : null,
    [info]
  );

  return (
    <>
      <td
        className='all no-pad'
        colSpan={5}
      />
      <RefEnd
        label={info.type}
        when={when}
      />
    </>
  );
}

export default React.memo(RefOther);
