// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { useStakingAsyncApis } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Banner from './Banner.js';

const BannerAssetHubMigration = () => {
  const { t } = useTranslation();
  const { ahEndPoints, isRelayChain } = useStakingAsyncApis();

  const assetHubEndPoint = useMemo(() => {
    return ahEndPoints[Math.floor(Math.random() * ahEndPoints.length)];
  }, [ahEndPoints]);

  if (!isRelayChain) {
    return null;
  }

  return (
    <Banner type='warning'>
      <p>
        {t('After Asset Hub migration, all funds have been moved to Asset Hub. Please switch to the ')}
        <a
          href={`/?rpc=${assetHubEndPoint}#/accounts`}
          rel='noopener noreferrer'
          target='_blank'
        >
          {t('Asset Hub chain')}
        </a>
        {t(' to view your balances and details.')}
      </p>
      <p>{t('For more information about Asset Hub migration, check the ')}
        <a href='https://support.polkadot.network/support/solutions/articles/65000190561#What-would-happen-after-the-migration?'>details here</a>.
      </p>
    </Banner>
  );
};

export default React.memo(BannerAssetHubMigration);
