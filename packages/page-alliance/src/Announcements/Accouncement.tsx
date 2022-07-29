// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Cid } from '../types';

import React, { useMemo } from 'react';

interface Props {
  className?: string;
  value: Cid;
}

function Website ({ className, value: { cid: { codec, hash_: { code }, version }, ipfs } }: Props): React.ReactElement<Props> {
  const url = useMemo(
    // () => ipfs && `https://cloudflare-ipfs.com/ipfs/${ipfs}`
    () => ipfs && `https://ipfs.io/ipfs/${ipfs}`,
    [ipfs]
  );

  return (
    <tr className={className}>
      <td className='start all'>
        {url && (
          <a
            href={url}
            rel='noopener noreferrer'
            target='_blank'
          >{ipfs}</a>
        )}
      </td>
      <td className='number'>
        {version.type}
      </td>
      <td className='number'>
        0x{codec.toString(16)}
      </td>
      <td className='number'>
        0x{code.toString(16)}
      </td>
    </tr>
  );
}

export default React.memo(Website);
