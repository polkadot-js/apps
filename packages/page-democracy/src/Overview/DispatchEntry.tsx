// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveDispatch } from '@polkadot/api-derive/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { LinkExternal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import ProposalCell from './ProposalCell';
import PreImageButton from './PreImageButton';

interface Props {
  value: DeriveDispatch;
}

function DispatchEntry ({ value: { at, image, imageHash, index } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []) || new BN(0);

  return (
    <tr>
      <td className='number top'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        imageHash={imageHash}
        proposal={image?.proposal}
      />
      <td className='number together top'>
        {bestNumber && (
          <>
            <label>{t('enact')}</label>
            <BlockToTime blocks={at.sub(bestNumber)} />
            #{formatNumber(at)}
          </>
        )}
      </td>
      <td className='together number top'>
        {!image?.proposal && (
          <PreImageButton
            imageHash={imageHash}
            isImminent
          />
        )}
        <LinkExternal
          data={index}
          type='referendum'
        />
      </td>
    </tr>
  );
}

export default React.memo(DispatchEntry);
