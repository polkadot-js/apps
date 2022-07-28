// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Cid } from '../types';

import React from 'react';

interface Props {
  className?: string;
  value: Cid;
}

function Website ({ className, value: { cid: { codec, version }, ipfs } }: Props): React.ReactElement<Props> {
  // TODO IPFS link
  return (
    <tr className={className}>
      <td className='start all'>
        {ipfs}
      </td>
      <td className='number'>
        {version.type}
      </td>
      <td className='number'>
        {codec.toString()}
      </td>
    </tr>
  );
}

export default React.memo(Website);
