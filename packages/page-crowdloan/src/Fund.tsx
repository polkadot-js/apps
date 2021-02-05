// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FundIndex, FundInfo } from '@polkadot/types/interfaces';

import React from 'react';

interface Props {
  className?: string;
  id: FundIndex;
  info: FundInfo;
}

function Fund ({ className, id, info }: Props): React.ReactElement<Props> {
  return (
    <tr className={className}>
      <td className='number'><h1>{id}</h1></td>
      <td className='all'>{JSON.stringify(info.toHuman())}</td>
    </tr>
  );
}

export default React.memo(Fund);
