// Copyright 2017-2022 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React from 'react';

interface Props {
  className?: string;
  value: HexString;
}

function Hash ({ className, value }: Props): React.ReactElement<Props> {
  return (
    <tr className={ className }>
      <td>
        {value}
      </td>
    </tr>
  );
}

export default React.memo(Hash);
