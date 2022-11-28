// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReferendumProps as Props } from '../types';

import React, { useMemo } from 'react';

function RefOther ({ value: { info } }: Props): React.ReactElement<Props> {
  const when = useMemo(
    () => info.isKilled
      ? new Date(info.asKilled.toNumber())
      : null,
    [info]
  );

  return (
    <>
      <td
        className='number'
        colSpan={2}
      />
      <td
        className='number'
        colSpan={2}
      >
        {when && (
          when.toUTCString()
        )}
      </td>
      <td className='number'>
        {info.type}
      </td>
    </>
  );
}

export default React.memo(RefOther);
