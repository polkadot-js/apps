// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveDispatch } from '@polkadot/api-derive/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import { LinkExternal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import ProposalCell from '../Overview/ProposalCell';
import PreImageButton from '../Overview/PreImageButton';

interface Props {
  value: DeriveDispatch;
}

function DispatchEntry ({ value: { at, image, imageHash, index } }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);

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
      <td className='links media--1000'>
        <LinkExternal
          data={index}
          isLogo
          type='referendum'
        />
      </td>
    </tr>
  );
}

export default React.memo(DispatchEntry);
