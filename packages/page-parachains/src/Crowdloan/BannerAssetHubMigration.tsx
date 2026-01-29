// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { MarkWarning, styled } from '@polkadot/react-components';
import { useStakingAsyncApis } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

const BannerAssetHubMigration = () => {
  const { t } = useTranslation();
  const { isRelayChain } = useStakingAsyncApis();

  if (!isRelayChain) {
    return null;
  }

  return (
    <StyledBanner
      className='warning centered'
      withIcon={false}
    >
      <p>
        {t('After the Asset Hub migration, crowdloan related activity has been transferred to the `ah_ops` pallet on Asset Hub. You can claim your funds from there, or visit ')}
        <a
          href='https://polkadot-crowdloan.com/'
          rel='noopener noreferrer'
          target='_blank'
        >
          {t('the Polkadot Crowdloan UI')}
        </a>
        {t(' for more details.')}
      </p>
    </StyledBanner>
  );
};

const StyledBanner = styled(MarkWarning)`
  border: 1px solid #ffc107;
  background: #ffc10720;
  font-size: 1rem !important;
`;

export default React.memo(BannerAssetHubMigration);
