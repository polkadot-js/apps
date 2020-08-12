// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { POLKADOT_DENOM_BLOCK, POLKADOT_GENESIS } from '@polkadot/apps-config/api/constants';
import { useApi } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import Banner from './Banner';

function BannerDOT (): React.ReactElement | null {
  const { api } = useApi();
  const [isPolkadot] = useState(api.genesisHash.eq(POLKADOT_GENESIS));

  if (!isPolkadot) {
    return null;
  }

  return (
    <Banner type='warning'>
      <p><Trans key='dotRenom1'>On approximately August 21st at 13:15 UTC (block number {formatNumber(POLKADOT_DENOM_BLOCK)}), the DOT token will undergo a <a href='#/poll'>redenomination</a> from its original sale.</Trans></p>
      <p><Trans key='dotRenom2'>New DOTs will be 100x smaller than DOTs (old). Therefore, your DOT balance will be 100x higher and the price per DOT will be 100x lower. The percentage of the DOTs you own relative to total supply will be unchanged. This will not affect the total value of your position.</Trans></p>
      <p><Trans key='dotRenom3'>See the <a
        href='https://polkadot.network/the-results-are-in/'
        rel='noopener noreferrer'
        target='_blank'
      >Polkadot blog post</a> for more information.</Trans></p>
    </Banner>
  );
}

export default React.memo(BannerDOT);
