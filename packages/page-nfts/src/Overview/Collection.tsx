// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { CollectionInfo } from '../types';

import React from 'react';

import { AddressSmall, IconLink } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  value: CollectionInfo;
}

function Collection ({ className, value: { details, id, ipfsData } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const name = ipfsData?.name || '';
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
      <td className='address media--1000'>{details && <AddressSmall value={details.owner} />}</td>
      <td className='string'>{details && details.isFrozen.isTrue && t('Frozen')}</td>
      <td className='number'>{details && formatNumber(details.items || (details as unknown as { instances: BN }).instances)}</td>
    </tr>
  );
}

export default React.memo(Collection);
