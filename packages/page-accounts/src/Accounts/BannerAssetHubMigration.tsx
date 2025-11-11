// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { styled } from '@polkadot/react-components';
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
    <StyledBanner type='warning'>
      <p>
        {t('After Asset Hub migration, all funds have been moved to Asset Hub. Please switch to the ')}
        <a
          href={`${window.location.origin}${window.location.pathname}?rpc=${assetHubEndPoint}#/accounts`}
          rel='noopener noreferrer'
          target='_blank'
        >
          {t('Asset Hub chain')}
        </a>
        {t(' to view your balances and details.')}
        <br />
        {t('For more information about Asset Hub migration, check the ')}
        <a
          href='https://support.polkadot.network/support/solutions/articles/65000190561#What-would-happen-after-the-migration?'
          rel='noopener noreferrer'
          target='_blank'
        >details here</a>.
      </p>
    </StyledBanner>
  );
};

const StyledBanner = styled(Banner)`
  border: 1px solid #ffc107;
  font-size: 1rem !important;
`;

export default React.memo(BannerAssetHubMigration);
