// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveDispatch } from '@polkadot/api-derive/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import { LinkExternal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { BN_ZERO, formatNumber } from '@polkadot/util';

import ProposalCell from './ProposalCell';
import PreImageButton from './PreImageButton';

interface Props {
  value: DeriveDispatch;
}

function DispatchEntry ({ value: { at, image, imageHash, index } }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []) || BN_ZERO;

  return (
    <tr>
      <td className='number'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        imageHash={imageHash}
        proposal={image?.proposal}
      />
      <td className='number together'>
        {bestNumber && (
          <>
            <BlockToTime blocks={at.sub(bestNumber)} />
            #{formatNumber(at)}
          </>
        )}
      </td>
      <td className='button'>
        {!image?.proposal && (
          <PreImageButton
            imageHash={imageHash}
            isImminent
          />
        )}
      </td>
      <td className='mini ui--media-1000'>
        <LinkExternal
          data={index}
          type='referendum'
          withShort
        />
      </td>
    </tr>
  );
}

export default React.memo(DispatchEntry);
