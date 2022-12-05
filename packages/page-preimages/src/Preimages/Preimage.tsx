// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React from 'react';

import { CallExpander } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import usePreimage from '../usePreimage';
import Hash from './Hash';

interface Props {
  className?: string;
  value: HexString;
}

function Preimage ({ className, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const info = usePreimage(value);

  return (
    <tr className={ className }>
      <Hash value={value} />
      <td className='all'>
        {info?.proposal && (
          <CallExpander
            labelHash={t<string>('proposal')}
            value={info.proposal}
          />
        )}
      </td>
      <td className='number'>
        {info?.bytes && formatNumber(info.bytes.length)}
      </td>
      <td className='number'>
        {info?.status?.type}
      </td>
      <td className='number'>
        {info && info.count !== 0 && formatNumber(info.count)}
      </td>
    </tr>
  );
}

export default React.memo(Preimage);
