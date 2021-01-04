// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '@polkadot/react-components/types';
import type { Option } from '@polkadot/types';
import type { BlockNumber, HeadData, ParaId } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import { useApi, useCall } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  id: ParaId;
}

const transformHead = {
  transform: (headData: Option<HeadData>): string | null => {
    if (headData.isSome) {
      const hex = headData.unwrap().toHex();

      return `${hex.slice(0, 18)}…${hex.slice(-16)}`;
    }

    return null;
  }
};

const transformMark = {
  transform: (watermark: Option<BlockNumber>): string | null =>
    watermark.isSome
      ? watermark.unwrap().toHuman()
      : null
};

function Parachain ({ className = '', id }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const headHex = useCall<string | null>(api.query.paras.heads, [id], transformHead);
  const watermark = useCall<string | null>(api.query.hrmp.hrmpWatermarks, [id], transformMark);

  return (
    <tr className={className}>
      <td className='number'>
        <h1>{id.toString()}</h1>
      </td>
      <td />
      <td className='all start together headhex'>{headHex}</td>
      <td className='number'>{watermark}</td>
    </tr>
  );
}

export default React.memo(styled(Parachain)(({ theme }: ThemeProps) => `
  td.headhex {
    font: ${theme.fontMono};
  }
`));
