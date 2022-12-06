// Copyright 2017-2022 @polkadot/app-scheduler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveDispatch } from '@polkadot/api-derive/types';

import React from 'react';

import PreImageButton from '@polkadot/app-democracy/Overview/PreImageButton';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { LinkExternal } from '@polkadot/react-components';
import { useBestNumber } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  value: DeriveDispatch;
}

function DispatchEntry ({ value: { at, image, imageHash, index } }: Props): React.ReactElement<Props> {
  const bestNumber = useBestNumber();

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
            <BlockToTime value={at.sub(bestNumber)} />
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
          type='referendum'
        />
      </td>
    </tr>
  );
}

export default React.memo(DispatchEntry);
