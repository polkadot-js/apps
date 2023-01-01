// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReferendumProps as Props } from '../types';

import React, { useMemo } from 'react';

import RefEnd from './RefEnd';

function RefOther ({ value: { info } }: Props): React.ReactElement<Props> {
  const when = useMemo(
    () => info.isKilled
      ? info.asKilled
      : null,
    [info]
  );

  return (
    <>
      <td className='all' />
      <td className='address' />
      <RefEnd
        label={info.type}
        when={when}
      />
      <td
        className='number'
        colSpan={4}
      />
    </>
  );
}

export default React.memo(RefOther);
