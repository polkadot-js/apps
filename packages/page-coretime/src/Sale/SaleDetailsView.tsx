// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainName, SaleParameters } from '../types.js';

import React from 'react';

import { Button, styled } from '@polkadot/react-components';

import { PhaseName } from '../constants.js';
import PhaseTable from './PhaseTable.js';
import { SubScanButton } from './SubScanButton.js';
import { useTranslation } from '../translate.js';

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
    description: 'The period during which cores are available for both purchase and renewal. The price is linearly declining price.',
    name: 'Price Discovery phase'
  },
  [PhaseName.FixedPrice]: {
    description: 'The period during which cores are available for both purchase and renewal. The price is fixed price towards the end of the sales period.',
    name: 'Fixed price phase'
  }
};

const SaleDetailsView = ({ chainName, chosenSaleNumber, saleParams }: { saleParams: SaleParameters, chosenSaleNumber: number, chainName: ChainName }) => {
  const { t } = useTranslation();
  if (chosenSaleNumber === -1 || !saleParams) {
    return null;
  }

  return (
    <ResponsiveContainer>
      <div>
        <Title>Sale phases</Title>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateRows: '1fr 1fr 1fr', minWidth: '200px' }}>
          {Object.entries(phases).map(([phase, { description, name }]) => (
            <div key={phase}>
              <h4>{name}</h4>
              <p style={{ maxWidth: '600px', opacity: '0.8' }}>{description}</p>
              {saleParams?.phaseConfig &&
                <PhaseTable
                  phaseInfo={saleParams?.phaseConfig.config[phase as keyof typeof saleParams.phaseConfig.config]}
                />}
            </div>
          ))}
        </div>
      </div>
      <div>
        <Title>Region for sale </Title>
        <p style={{ maxWidth: '600px', opacity: '0.8' }}>Region is an asset of Coretime. It signifies the upcoming sales period within which a core can be secured by purchasing coretime. Acquiring coretime grants access to a core for the duration of that specific region.</p>
        {saleParams?.regionForSale && <PhaseTable phaseInfo={saleParams?.regionForSale} />}
        <Title>Price graph</Title>
        <Button
          isBasic
          label={t(`Open Subscan Sale Price graph`)}
          onClick={() => { window.open(`https://coretime-${chainName}.subscan.io/coretime_dashboard`); }}
        />
        <Title>Core Purchase Transactions</Title>
        <SubScanButton
          chainName={chainName}
          chosenSaleNumber={chosenSaleNumber}
          currentRegion={saleParams.currentRegion}
        />
        <Title>DotLake Coretime Dashboard</Title>
        <Button
          isBasic
          label={t(`DotLake Coretime Dashboard`)}
          onClick={() => { window.open(`https://data.parity.io/coretime`); }}
        />
        <Title>Coretime providers</Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(providers).map(([provider, { alt, href, logo }]) => (
            <LinkWithLogo
              alt={alt}
              href={href(chainName)}
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
