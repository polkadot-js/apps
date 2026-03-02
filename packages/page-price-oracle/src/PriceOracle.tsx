// Copyright 2017-2026 @polkadot/app-price-oracle authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';

import { Dropdown, styled, Table } from '@polkadot/react-components';

import PriceChart from './PriceChart.js';
import { useTranslation } from './translate.js';
import { useAssetPriceData, useTrackedAssets } from './usePriceData.js';

// Helper function to format FixedU128 price values
// FixedU128 has a base of 10^18
function formatPrice (priceStr: string): string {
  const priceNum = parseFloat(priceStr.replace(/,/g, ''));

  if (isNaN(priceNum)) {
    return 'N/A';
  }

  const denominated = priceNum / Math.pow(10, 18);

  // Format with appropriate decimal places
  return denominated.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  });
}

interface Props {
  className?: string;
}

function PriceOracle ({ className }: Props): React.ReactElement {
  const { t } = useTranslation();
  const trackedAssets = useTrackedAssets();
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  // Set default selected asset when assets are loaded
  React.useEffect(() => {
    if (trackedAssets && trackedAssets.length > 0 && !selectedAsset) {
      setSelectedAsset(trackedAssets[0]);
    }
  }, [trackedAssets, selectedAsset]);

  // Subscribe to price data for the selected asset (reactive)
  const priceData = useAssetPriceData(selectedAsset);

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('Price'), 'start'],
    [t('Confidence')],
    [t('Local Block')],
    [t('Relay Block')],
    [t('Timestamp')]
  ]);

  // Create dropdown options
  const assetOptions = trackedAssets?.map((assetId) => ({
    text: `Asset ${assetId}`,
    value: assetId
  })) || [];

  if (!trackedAssets || trackedAssets.length === 0) {
    return (
      <StyledDiv className={className}>
        <div>{t('No tracked assets found')}</div>
      </StyledDiv>
    );
  }

  return (
    <StyledDiv className={className}>
      <div className='asset-selector'>
        <Dropdown
          label={t('Select Asset')}
          onChange={setSelectedAsset}
          options={assetOptions}
          value={selectedAsset || trackedAssets[0]}
        />
      </div>

      {priceData && (
        <div className='asset-section'>
          <h2>{t('Asset {{assetId}}', { replace: { assetId: priceData.assetId } })}</h2>

          <PriceChart
            assetId={priceData.assetId}
            currentPrice={priceData.currentPrice}
            priceHistory={priceData.priceHistory}
          />

          {priceData.currentPrice ? (
            <div className='current-price'>
              <h3>{t('Current Price')}</h3>
              <Table
                empty={t('No price data')}
                header={headerRef.current}
              >
                <tr>
                  <td>{formatPrice(priceData.currentPrice.price)}</td>
                  <td>{priceData.currentPrice.confidence}</td>
                  <td>{priceData.currentPrice.updatedIn?.local || 'N/A'}</td>
                  <td>{priceData.currentPrice.updatedIn?.relay || 'N/A'}</td>
                  <td>{priceData.currentPrice.updatedIn?.timestamp || 'N/A'}</td>
                </tr>
              </Table>
            </div>
          ) : (
            <div className='no-price'>{t('No current price available')}</div>
          )}

          {priceData.priceHistory.length > 0 && (
            <div className='price-history'>
              <h3>{t('Price History')}</h3>
              <Table
                empty={t('No price history')}
                header={headerRef.current}
              >
                {[...priceData.priceHistory].reverse().map((price, index) => (
                  <tr key={index}>
                    <td>{formatPrice(price.price)}</td>
                    <td>{price.confidence}</td>
                    <td>{price.updatedIn?.local || 'N/A'}</td>
                    <td>{price.updatedIn?.relay || 'N/A'}</td>
                    <td>{price.updatedIn?.timestamp || 'N/A'}</td>
                  </tr>
                ))}
              </Table>
            </div>
          )}
        </div>
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .asset-selector {
    margin-bottom: 2rem;
    max-width: 20rem;
  }

  .asset-section {
    margin-bottom: 2rem;

    h2 {
      margin-bottom: 1rem;
    }

    h3 {
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .current-price,
    .price-history {
      margin-bottom: 2rem;

      table {
        td, th {
          text-align: left !important;
        }

        td:first-child,
        th:first-child {
          padding-left: 1rem;
        }
      }
    }

    .no-price {
      padding: 1rem;
      color: var(--color-label);
    }
  }
`;

export default React.memo(PriceOracle);
