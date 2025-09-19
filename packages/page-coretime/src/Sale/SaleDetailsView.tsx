// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RelayName, SaleParameters } from '../types.js';

import React, { useMemo } from 'react';

import { styled } from '@polkadot/react-components';

import { PhaseName } from '../constants.js';
import { useTranslation } from '../translate.js';
import PhaseTable from './PhaseTable.js';
import { SubscanModuleCallUrl } from './SubscanModuleCallUrl.js';

const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 10rem;
  margin-top: 2rem;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const Title = styled.h3`
  font-weight: bold;
  margin-bottom: 1rem;
`;

const LinkWithLogo = ({ alt, href, logo }: { href: string, logo: string, alt: string }) => {
  return (
    <a
      href={href}
      rel='noopener noreferrer'
      target='_blank'
    >
      <img
        alt={alt}
        height={25}
        src={logo}
      />
    </a>
  );
};

const providers = {
  lastic: {
    alt: 'Lastic',
    href: (chainName: string) => `https://www.lastic.xyz/${chainName}/bulkcore1`,
    logo: 'https://www.lastic.xyz/_next/image?url=%2Fassets%2FImages%2FLogos%2Flastic-logo.png&w=384&q=100'
  },
  regionx: {
    alt: 'RegionX',
    href: (chainName: string) => `https://app.regionx.tech/?network=${chainName}`,
    logo: 'https://app.regionx.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.8f0fd171.png&w=3840&q=75'
  },
  subscan: {
    alt: 'Subscan',
    href: (chainName: string) => `https://coretime-${chainName}.subscan.io/coretime_dashboard`,
    logo: 'https://www.subscan.io/_next/image?url=%2Fwebsite%2Flogo-light.png&w=256&q=75'
  }
};

const phases = {
  [PhaseName.Renewals]: {
    description: 'In this phase, core owners can renew existing cores at a fixed price to ensure continued operation in the next region. No new core purchases are permitted.',
    name: 'Interlude/Renewals phase'
  },
  [PhaseName.PriceDiscovery]: {
    description: 'The period during which cores are available for both purchase and renewal. The price decreases linearly over time.',
    name: 'Price Discovery phase'
  },
  [PhaseName.FixedPrice]: {
    description: 'The period during which cores are available for both purchase and renewal. The price remains fixed towards the end of the sales period.',
    name: 'Fixed price phase'
  }
};

const dotLakeUrl = 'https://data.parity.io/coretime';

const SaleDetailsView = ({ chosenSaleNumber, relayName, saleParams }: { saleParams: SaleParameters, chosenSaleNumber: number, relayName: RelayName }) => {
  const { t } = useTranslation();

  const subscanPriceGraphUrl = useMemo(() =>
    `https://coretime-${relayName}.subscan.io/coretime_dashboard`
  , [relayName]);

  if (chosenSaleNumber === -1 || !saleParams) {
    return null;
  }

  return (
    <ResponsiveContainer>
      <div>
        <Title>Sale phases</Title>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateRows: '1fr 1fr 1fr', minWidth: '200px' }}>
          {!saleParams?.phaseConfig &&
            <div>
              <p>{t(`This sale is of unusual length of ${saleParams.currentRegion.end.ts - saleParams.currentRegion.start.ts} timeslices, hence the regular phases are not applicable.`)}</p>
              <p>{t(`Sale start timeslice: ${saleParams.currentRegion.start.ts}`)}</p>
              <p>{t(`Sale end timeslice: ${saleParams.currentRegion.end.ts}`)}</p>
            </div>
          }
          {saleParams?.phaseConfig && Object.entries(phases).map(([phase, { description, name }]) => (
            <div key={phase}>
              <h4>{t(name)}</h4>
              <p style={{ maxWidth: '600px', opacity: '0.8' }}>{t(description)}</p>
              {saleParams?.phaseConfig &&
                <PhaseTable
                  phaseInfo={saleParams?.phaseConfig.config[phase as keyof typeof saleParams.phaseConfig.config]}
                />}
            </div>
          ))}
        </div>
      </div>
      <div>
        <Title>{t('Region for sale ')}</Title>
        <p style={{ maxWidth: '600px', opacity: '0.8' }}>{t('Region is an asset of Coretime. It signifies the upcoming sales period within which a core can be secured by purchasing coretime. Acquiring coretime grants access to a core for the duration of that specific region.')}</p>
        {saleParams?.regionForSale && <PhaseTable phaseInfo={saleParams?.regionForSale} />}
        <Title>{t('Subscan Links')}</Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a
            href={subscanPriceGraphUrl}
            rel='noopener noreferrer'
            target='_blank'
          >Sale Purchase Graph</a>
          <SubscanModuleCallUrl
            chainName={relayName}
            chosenSaleNumber={chosenSaleNumber}
            currentRegion={saleParams.currentRegion}
            urlTitle='Sale Purchase Transactions'
          />
          <SubscanModuleCallUrl
            call={'renew'}
            chainName={relayName}
            chosenSaleNumber={chosenSaleNumber}
            currentRegion={saleParams.currentRegion}
            urlTitle='Sale Renewal Transactions'
          />
        </div>
        <Title>{t('DotLake Coretime Dashboard')}</Title>
        <a
          href={dotLakeUrl}
          rel='noopener noreferrer'
          target='_blank'
        >Dot Lake</a>
        <Title>{t('Coretime providers')}</Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(providers).map(([provider, { alt, href, logo }]) => (
            <LinkWithLogo
              alt={alt}
              href={href(relayName)}
              key={provider}
              logo={logo}
            />
          ))}
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default SaleDetailsView;
