// Copyright 2017-2025 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ItemInfo } from './types.js';

import React from 'react';

import { AddressSmall, IconLink, Table } from '@polkadot/react-components';

interface Props {
  className?: string;
  collectionName: string;
  value: ItemInfo;
}

function Item ({ className, collectionName, value: { account, id, ipfsData } }: Props): React.ReactElement<Props> {
  const name = ipfsData?.name || collectionName;
  let imageLink = '';

  if (ipfsData?.image) {
    imageLink = ipfsData.image.toLowerCase().startsWith('http') ? ipfsData.image : `https://ipfs.io/ipfs/${ipfsData.image}`;
  }

  return (
    <tr className={className}>
      <Table.Column.Id value={id} />
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
