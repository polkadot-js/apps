// Copyright 2017-2026 @polkadot/app-price-oracle authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef } from 'react';

import { Chart, styled } from '@polkadot/react-components';

import { useTranslation } from './translate.js';
import type { PriceData } from './usePriceData.js';

interface Props {
  assetId: string;
  currentPrice: PriceData | null;
  priceHistory: PriceData[];
  className?: string;
}

function PriceChart ({ assetId, className, currentPrice, priceHistory }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const { labels, values } = useMemo(() => {
    // Combine current price and history, sorted by block number
    const allPrices = [
      ...priceHistory,
      ...(currentPrice ? [currentPrice] : [])
    ].sort((a, b) => {
      const aBlock = parseInt(a.updatedIn?.local || '0');
      const bBlock = parseInt(b.updatedIn?.local || '0');

      return aBlock - bBlock;
    });

    if (allPrices.length === 0) {
      return { labels: [], values: [[]] };
    }

    // Extract labels (block numbers) and values (prices)
    const labels = allPrices.map((p) => p.updatedIn?.local || '?');
    const priceValues = allPrices.map((p) => {
      // Parse the price string (e.g., "1,522,000,000,000,000,000")
      // FixedU128 has a base of 10^18, so we need to divide by 10^18
      const priceStr = p.price.replace(/,/g, '');
      const priceNum = parseFloat(priceStr);

      if (isNaN(priceNum)) {
        return 0;
      }

      // Divide by 10^18 to get the actual denominated value
      return priceNum / Math.pow(10, 18);
    });

    return {
      labels,
      values: [priceValues]
    };
  }, [currentPrice, priceHistory]);

  const legendsRef = useRef([t('Price')]);
  const colorsRef = useRef([undefined]);

  if (labels.length === 0) {
    return null;
  }

  return (
    <StyledDiv className={className}>
      <Chart.Line
        colors={colorsRef.current}
        labels={labels}
        legends={legendsRef.current}
        title={t('Price History - Asset {{assetId}}', { replace: { assetId } })}
        values={values}
      />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--bg-table);
  border-radius: 0.25rem;
`;

export default React.memo(PriceChart);
