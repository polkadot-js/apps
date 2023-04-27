// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReferendumProps as Props } from '../types.js';

import React from 'react';

function RefOther ({ value: { info: { type } } }: Props): React.ReactElement<Props> {
  return (
    <td
      className='number'
      colSpan={5}
    >
      {type}
    </td>
  );
}

export default React.memo(RefOther);
