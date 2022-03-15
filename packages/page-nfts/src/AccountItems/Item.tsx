// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ItemInfo } from './types';

import React from 'react';

import { AddressSmall, IconLink } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

interface Props {
  className?: string;
  collectionName: string;
  value: ItemInfo;
}

function Item ({ className, collectionName, value: { account, id, ipfsData } }: Props): React.ReactElement<Props> {
  const name = ipfsData?.name || collectionName;
  const imageLink = ipfsData?.image ? `https://ipfs.io/ipfs/${ipfsData.image}` : '';

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='together all'>
        { name && imageLink
          ? (
            <IconLink
              href={imageLink}
              icon='braille'
              label={name}
              rel='noopener'
              target='_blank'
            />)
          : name
        }
      </td>
      <td className='address media--1000'><AddressSmall value={account} /></td>
    </tr>
  );
}

export default React.memo(Item);
