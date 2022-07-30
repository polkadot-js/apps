// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Bytes } from '@polkadot/types';
import type { Call } from '@polkadot/types/interfaces';
import type { HexString } from '@polkadot/util/types';

import React, { useMemo } from 'react';

import { CallExpander } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';
import useHashInfo from './useHashInfo';

interface Props {
  className?: string;
  value: HexString;
}

function decodeBytes (api: ApiPromise, bytes: Bytes): Call | null {
  try {
    return api.registry.createType('Call', bytes.toU8a(true));
  } catch (error) {
    console.error(error);
  }

  return null;
}

function Hash ({ className, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const info = useHashInfo(value);
  const decoded = useMemo(
    () => info && info.bytes && decodeBytes(api, info.bytes),
    [api, info]
  );

  return (
    <tr className={ className }>
      <td>
        {value}
      </td>
      <td className='all'>
        {decoded && (
          <CallExpander
            labelHash={t<string>('proposal')}
            value={decoded}
          />
        )}
      </td>
      <td className='number'>
        {info && info.bytes && formatNumber(info.bytes.length)}
      </td>
      <td className='number'>
        {info && info.status && info.status.type}
      </td>
    </tr>
  );
}

export default React.memo(Hash);
