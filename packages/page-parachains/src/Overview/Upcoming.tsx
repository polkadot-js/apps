// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { ParaGenesisArgs, ParaId } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { sliceHex } from './util';

interface Props {
  id: ParaId;
}

const transformGenesis = {
  transform: (opt: Option<ParaGenesisArgs>) => opt.unwrapOr(null)
};

function Upcoming ({ id }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const info = useCall<ParaGenesisArgs | null>(api.query.paras.upcomingParasGenesis, [id], transformGenesis);

  return (
    <tr key={id.toString()}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='all start together hash'>
        {info && (
          sliceHex(info.genesisHead, 8)
        )}
      </td>
      <td className='start'>
        {info && (
          info.parachain ? t('Yes') : t('No')
        )}
      </td>
    </tr>
  );
}

export default React.memo(Upcoming);
