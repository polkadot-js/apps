// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { POLKADOT_DENOM_BLOCK, POLKADOT_GENESIS } from '@polkadot/apps-config/api/constants';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Banner from './Banner';

function BannerDOT (): React.ReactElement | null {
  const { api } = useApi();
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  const [isPolkadot] = useState(api.genesisHash.eq(POLKADOT_GENESIS));

  if (!isPolkadot || !bestNumber) {
    return null;
  }

  const remaining = POLKADOT_DENOM_BLOCK.sub(bestNumber);
  const endDate = remaining.gtn(0)
    ? new Date(Date.now() + (remaining.toNumber() * 6000))
      .toUTCString()
      .replace('GMT', 'UTC')
      .replace(/^[a-zA-Z]{3}, /, '')
      .replace(/:[0-9]{2} UTC/, ' UTC')
    : null;

  return (
    <Banner type='warning'>
      <p>{
        endDate
          ? <Trans key='dotRenomGoing'>On approximately {endDate} (block number {formatNumber(POLKADOT_DENOM_BLOCK)} in <BlockToTime
            blocks={remaining}
            isInline
          />), the DOT token will undergo a <a href='#/poll'>redenomination</a> from its original sale.</Trans>
          : <Trans key='dotRenomDone'>At block number {formatNumber(POLKADOT_DENOM_BLOCK)} the DOT token underwent a <a href='#/poll'>redenomination</a> from its original sale.</Trans>
      }</p>
      <p>{
        endDate
          ? <Trans key='dotRenomSizeGoing'>New DOT will be 100x smaller than DOT (old). Therefore, your DOT balance will be 100x higher and the price per DOT will be 100x lower. The percentage of the DOT you own relative to total supply will be unchanged. This will not affect the total value of your position.</Trans>
          : <Trans key='dotRenomSizeDone'>New DOT are 100x smaller than DOT (old). Therefore, your DOT balance is 100x higher and the price per DOT is 100x lower. The percentage of the DOT you own relative to total supply is unchanged. This does not affect the total value of your position.</Trans>
      }</p>
      <p><Trans key='dotRenomLink'>See the <a
        href='https://polkadot.network/the-results-are-in/'
        rel='noopener noreferrer'
        target='_blank'
      >Polkadot blog post</a> for more information.</Trans></p>
    </Banner>
  );
}

export default React.memo(BannerDOT);
