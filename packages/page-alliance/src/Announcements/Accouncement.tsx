// Copyright 2017-2025 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Cid } from '../types.js';

import React from 'react';

import { useIpfsLink } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  value: Cid;
}

function Website ({ className, value: { cid: { codec, hash_: { code }, version }, ipfs } }: Props): React.ReactElement<Props> {
  const ipfsLink = useIpfsLink(ipfs);

  return (
    <tr className={className}>
      <td className='start all'>
        {ipfsLink && (
          <a
            href={ipfsLink.ipfsUrl}
            rel='noopener noreferrer'
            target='_blank'
          >{ipfsLink.ipfsHash}</a>
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
