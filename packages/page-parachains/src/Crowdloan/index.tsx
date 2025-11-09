// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionInfo, Campaigns, LeasePeriod, OwnedId } from '../types.js';

import React from 'react';

import { Button, MarkWarning } from '@polkadot/react-components';
import { useBestNumber } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import BannerAssetHubMigration from './BannerAssetHubMigration.js';
import FundAdd from './FundAdd.js';
import Funds from './Funds.js';
import Summary from './Summary.js';

interface Props {
  auctionInfo?: AuctionInfo;
  campaigns: Campaigns;
  className?: string;
  leasePeriod?: LeasePeriod;
  ownedIds: OwnedId[];
}

function Crowdloan ({ auctionInfo, campaigns: { activeCap, activeRaised, funds, isLoading, totalCap, totalRaised }, className, leasePeriod, ownedIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const bestNumber = useBestNumber();

  return (
    <div className={className}>
      <BannerAssetHubMigration />
      <MarkWarning
        className='warning centered'
        content={t('Crowdloans will be deprecated in favor of Coretime. When Coretime is active in Polkadot, this page will be removed.')}
      />
      <Summary
        activeCap={activeCap}
        activeRaised={activeRaised}
        fundCount={funds?.length}
        isLoading={isLoading}
        totalCap={totalCap}
        totalRaised={totalRaised}
      />
      <Button.Group>
        <FundAdd
          auctionInfo={auctionInfo}
          bestNumber={bestNumber}
          leasePeriod={leasePeriod}
          ownedIds={ownedIds}
        />
      </Button.Group>
      <Funds
        bestNumber={bestNumber}
        leasePeriod={leasePeriod}
        value={funds}
      />
    </div>
  );
}

export default React.memo(Crowdloan);
