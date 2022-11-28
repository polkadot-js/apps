// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React from 'react';

import { CallExpander } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import usePreimage from '../usePreimage';

interface Props {
  className?: string;
  value: HexString;
}

function Preimage ({ className, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const info = usePreimage(value);

  return (
    <tr className={ className }>
      <td>{value}</td>
      <td className='all'>
        {info && info.proposal && (
          <CallExpander
            labelHash={t<string>('proposal')}
            value={info.proposal}
          />
        )}
      </td>
      <td className='number'>
        {info && info.bytes && formatNumber(info.bytes.length)}
      </td>
      <td className='number'>
        {info && info.status && info.status.type}
      </td>
      <td className='number'>
        {info && info.count !== 0 && formatNumber(info.count)}
      </td>
    </tr>
  );
}

export default React.memo(Preimage);
