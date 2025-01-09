// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProgressBarSection } from '@polkadot/react-components/types';
import type { BlockNumber } from '@polkadot/types/interfaces';
import type { ChainName, SaleDetails } from '../types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, CardSummary, Dropdown, styled, SummaryBox } from '@polkadot/react-components';
import ProgressBar from '@polkadot/react-components/ProgressBar';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance, formatNumber } from '@polkadot/util';

import { PhaseName } from '../constants.js';
import { useCoretimeContext } from '../CoretimeContext.js';
import { useTranslation } from '../translate.js';
import { constructSubscanQuery } from '../utils/index.js';
import { calculateSaleDetails, getCorePriceAt, getSaleParameters, getSaleProgress } from '../utils/sale.js';
import PhaseTable from './PhaseTable.js';
import Summary from './Summary.js';

interface Props {
  chainName: ChainName
}

const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

function Sale({ chainName }: Props): React.ReactElement<Props> {
  const { coretimeInfo, get } = useCoretimeContext();
  const { api, apiCoretime, isApiReady } = useApi();
  const { t } = useTranslation();
  const regionBegin = coretimeInfo?.salesInfo?.regionBegin;
  const lastCommittedTimeslice = coretimeInfo?.status?.lastTimeslice;
  const bestNumberFinalized = useCall<BlockNumber>(apiCoretime?.derive.chain.bestNumberFinalized);

  const coretimePrice = useMemo(() => get && bestNumberFinalized && getCorePriceAt(bestNumberFinalized.toNumber(), coretimeInfo?.salesInfo), [coretimeInfo?.salesInfo, get, bestNumberFinalized]);
  const saleParams = coretimeInfo && getSaleParameters(
    coretimeInfo.salesInfo,
    coretimeInfo.config,
    chainName,
    lastCommittedTimeslice ?? 0,
    coretimeInfo.constants
  );
  const phaseName = useMemo(() => saleParams?.phaseConfig?.currentPhaseName, [saleParams]);
  const [chosenSaleNumber, setChosenSaleNumber] = useState<number>(-1);
  const [saleDetails, setSaleDetails] = useState<SaleDetails | null>(null);
  const saleNumberOptions = useMemo(() =>
    [
      {
        text: t('Pick a sale number'),
        value: -1
      },
      ...Array.from({ length: saleParams?.saleNumber ?? 0 }, (_, i) => ({
        text: `sale #${i + 1}`,
        value: i
      })).reverse()

    ]
    , [saleParams, t]);

  const progressValues = useMemo(() => saleParams && regionBegin && getSaleProgress(lastCommittedTimeslice, saleParams.currentRegion.start.ts, saleParams.interlude.ts, saleParams.leadin.ts, regionBegin),
    [saleParams, lastCommittedTimeslice, regionBegin]);

  const soldOut = useMemo(() => coretimeInfo?.salesInfo.coresOffered === coretimeInfo?.salesInfo.coresSold, [coretimeInfo?.salesInfo.coresOffered, coretimeInfo?.salesInfo.coresSold]);

  useEffect(() => {
    if (saleNumberOptions.length > 1 && chosenSaleNumber === -1) {
      setChosenSaleNumber(saleNumberOptions[1].value);
    }
  }, [saleNumberOptions, chosenSaleNumber]);

  // TODO: uncomment when introducing core purchase functionality
  // const available = getAvailableNumberOfCores(coretimeInfo);

  const onDropDownChange = useCallback((value: number) => {
    setChosenSaleNumber(value);
    setSaleDetails(null);

    if (value === -1) {
      setSaleDetails(null);
    } else {
      get && saleParams && setSaleDetails(calculateSaleDetails(
        value,
        saleParams?.saleNumber,
        get.blocks.relay(coretimeInfo.status.lastTimeslice),
        chainName,
        coretimeInfo.config.regionLength,
        saleParams,
        coretimeInfo.constants
      ));
    }
  }, [get, saleParams, coretimeInfo, chainName]);

  const onQuerySaleClick = useCallback(() => {
    if (saleDetails) {
      window.open(constructSubscanQuery(saleDetails.coretime.start.block, saleDetails.coretime.end.block, chainName));
    }
  }, [saleDetails, chainName]);

  return (
    <div>
      {coretimeInfo && saleParams &&
        <Summary
          api={isApiReady ? api : null}
          config={coretimeInfo?.config}
          constants={coretimeInfo?.constants}
          region={coretimeInfo?.region}
          saleInfo={coretimeInfo?.salesInfo}
          saleNumber={saleParams?.saleNumber}
          status={coretimeInfo?.status}
        />}
      <div style={{ alignItems: 'stretch', display: 'grid', flexFlow: '1', gap: '2rem', gridTemplateColumns: '1fr 1fr 3fr', gridTemplateRows: 'auto auto', marginTop: '4rem' }}>

        <div style={{ backgroundColor: 'white', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyItems: 'center', justifySelf: 'right', minWidth: '250px', padding: '24px' }}>
          <p style={{ fontSize: '14px', opacity: '0.8' }}>Cores sale</p>
          {phaseName === PhaseName.Renewals
            ? (
              <h4>Cores cannot be purchased now</h4>
            )
            : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {soldOut && (
                  <h4>All cores are sold out</h4>
                )}
                {!soldOut && (
                  <div>
                    <p style={{ fontSize: '14px', marginBottom: '0.25rem' }}>current price</p>
                    <p style={{ fontSize: '20px' }}>  {coretimePrice && formatBalance(coretimePrice)}</p>
                  </div>
                )}
              </div>
            )}
          {/* TODO: Add core purchase functionality */}
          {/* {<div style={{ marginTop: '8px' }}>
            <Button
              isBasic
              // isDisabled={!available || phaseName === PhaseName.Renewals}
              isDisabled={true}
              label={t('Purchase a core')}
              onClick={() => window.alert('yo')}
            />
          </div>} */}
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '4px', minWidth: 'fit-content', padding: '24px' }}>
          <p style={{ fontSize: '14px', opacity: '0.8' }}>Region for sale</p>
          {saleParams?.regionForSale &&
            <div style={{ display: 'flex', flexDirection: 'column' }}>

              <div>
                <p style={{ fontSize: '14px', marginBottom: '0.25rem' }}>date period</p>
                <p style={{ fontSize: '20px' }}>{saleParams?.regionForSale.start.date} - {saleParams?.regionForSale.end.date}</p>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ marginBottom: '0.25rem' }}>relay chain blocks</p>
                <p>{formatNumber(saleParams?.regionForSale.start.blocks)} - {formatNumber(saleParams?.regionForSale.end.blocks)}</p>
              </div>

            </div>}
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '4px', justifySelf: 'left', padding: '24px' }}>
          <p style={{ fontSize: '14px', opacity: '0.8' }}>Sale timeline</p>
          <SummaryBox>
            <section>
              {phaseName && <>
                <CardSummary label='current phase'>{phaseName}</CardSummary>
                <CardSummary label='current phase end'>{saleParams?.phaseConfig?.config[phaseName].end.date}</CardSummary>
                <CardSummary label='last phase block'>{formatNumber(saleParams?.phaseConfig?.config[phaseName].end.blocks.relay)}</CardSummary>
              </>}
              <CardSummary label='fixed price'>{formatBalance(coretimeInfo?.salesInfo.endPrice)}</CardSummary>
            </section>
            <section>

            </section>
          </SummaryBox>
          <ProgressBar sections={progressValues as ProgressBarSection[] ?? []} />
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '4px', gridColumn: '1 / -1', justifySelf: 'center', padding: '24px', width: '100%' }}>
          <h2>Sale information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ maxWidth: '300px' }}>
              <Dropdown
                className='isSmall'
                label={t('Pick a sale number')}
                onChange={onDropDownChange}
                options={saleNumberOptions}
                value={chosenSaleNumber}
              />
            </div>
            <ResponsiveContainer>
              {saleParams?.phaseConfig &&
                <div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Sale #{chosenSaleNumber + 1} phases</h3>
                  <div style={{ display: 'grid', gap: '1rem', gridTemplateRows: '1fr 1fr 1fr', minWidth: '200px' }}>
                    <div>
                      <h4 style={{}}>Interlude/Renewals phase</h4>
                      <p style={{ maxWidth: '600px', opacity: '0.8' }}>In this phase, core owners can renew existing cores at a fixed price to ensure continued operation in the next region. No new core purchases are permitted.</p>
                      {saleParams?.phaseConfig &&
                        <PhaseTable
                          phaseInfo={saleParams?.phaseConfig.config[PhaseName.Renewals]}
                        />}
                    </div>
                    <div>
                      <h4 style={{}}>Price Discovery phase</h4>
                      <p style={{ maxWidth: '600px', opacity: '0.8' }}>The period during which cores are available for both purchase and renewal. The price is linearly declining price.</p>
                      {saleParams?.phaseConfig &&
                        <PhaseTable
                          phaseInfo={saleParams?.phaseConfig.config[PhaseName.PriceDiscovery]}
                        />}
                    </div>
                    <div>
                      <h4 style={{}}>Fixed price phase</h4>
                      <p style={{ maxWidth: '600px', opacity: '0.8' }}>The period during which cores are available for both purchase and renewal. The price is fixed price towards the end of the sales period.</p>
                      {saleParams?.phaseConfig &&
                        <PhaseTable
                          phaseInfo={saleParams?.phaseConfig.config[PhaseName.FixedPrice]}
                        />}
                    </div>
                  </div>
                </div>
              }
              <div>
                <div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Sale #{chosenSaleNumber + 1} Transactions</h3>
                  {chosenSaleNumber > -1 && (
                    <Button
                      isBasic
                      label={t(`Query Subscan for sale #${chosenSaleNumber + 1} transactions`)}
                      onClick={onQuerySaleClick}
                    />
                  )}
                </div>
                <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Region for sale #${chosenSaleNumber + 1} </h3>
                <p style={{ maxWidth: '600px', opacity: '0.8' }}>Region is an asset of Coretime. It signifies the upcoming sales period within which a core can be secured by purchasing coretime. Acquiring coretime grants access to a core for the duration of that specific region.</p>
                {saleParams?.regionForSale &&
                  <PhaseTable
                    phaseInfo={saleParams?.regionForSale}
                  />}
                <h3 style={{ fontWeight: 'bold', marginTop: '2rem' }}>Coretime providers</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '2rem' }}>
                  <a
                    href={`https://app.regionx.tech/?network=${chainName}`}
                    rel='noopener noreferrer'
                    target='_blank'
                  ><img
                      alt='RegionX'
                      height={25}
                      src='https://app.regionx.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.8f0fd171.png&w=3840&q=75'
                    />
                  </a>
                  <a
                    href={`https://coretime-${chainName}.subscan.io/coretime_dashboard`}
                    rel='noopener noreferrer'
                    target='_blank'
                  ><img
                      alt='Subscan'
                      height={25}
                      src='https://www.subscan.io/_next/image?url=%2Fwebsite%2Flogo-light.png&w=256&q=75'
                    />
                  </a>
                  <a
                    href={`https://www.lastic.xyz/${chainName}/bulkcore1`}
                    rel='noopener noreferrer'
                    target='_blank'
                  ><img
                      alt='Lastic'
                      height={25}
                      src='https://www.lastic.xyz/_next/image?url=%2Fassets%2FImages%2FLogos%2Flastic-logo.png&w=384&q=100'
                    />
                  </a>
                </div>
              </div>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sale;
