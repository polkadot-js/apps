// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainName, SaleParameters } from '../types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Dropdown, styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useCoretimeContext } from '../CoretimeContext.js';
import { useTranslation } from '../translate.js';
import { getSaleParameters } from '../utils/sale.js';
import { Cores } from './boxes/Cores.js';
import { Region } from './boxes/Region.js';
import { Timeline } from './boxes/Timeline.js';
import SaleDetailsView from './SaleDetailsView.js';
import Summary from './Summary.js';


interface Props {
  chainName: ChainName
}

const ResponsiveGrid = styled.div`
  display: grid;
  align-items: stretch;
  gap: 2rem;
  grid-template-rows: auto auto;
  margin-top: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media (min-width: 769px) and (max-width: 1150px) {
    grid-template-columns: 1fr 1fr;
    
    > *:nth-child(3) {
      grid-column: 1 / -1;
    }
  }

  @media (min-width: 1150px) {
    grid-template-columns: 1fr 1fr 3fr;
  }
`;

function Sale({ chainName }: Props): React.ReactElement<Props> {
  const { coretimeInfo } = useCoretimeContext();
  const { api, isApiReady } = useApi();
  const { t } = useTranslation();
  const lastCommittedTimeslice = coretimeInfo?.status?.lastTimeslice;
  const [chosenSaleNumber, setChosenSaleNumber] = useState<number>(-1);
  const [saleParams, setSaleParams] = useState<SaleParameters | null>(null);
  const [selectedSaleParams, setSelectedSaleParams] = useState<SaleParameters | null>(null);
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


  // TODO: uncomment when introducing core purchase functionality
  // const available = getAvailableNumberOfCores(coretimeInfo);

  useEffect(() => {
    if (coretimeInfo && !saleParams) {
      setSaleParams(getSaleParameters(
        coretimeInfo,
        chainName,
        lastCommittedTimeslice ?? 0
      ));
    }
  }, [coretimeInfo, saleParams]);


  const phaseName = useMemo(() => saleParams?.phaseConfig?.currentPhaseName, [saleParams]);

  const onDropDownChange = (value: number) => {
    console.log('dropdown changed', value);
    setChosenSaleNumber(value);

    if (value !== -1) {
      if (!coretimeInfo) {
        return;
      }

      setSelectedSaleParams(getSaleParameters(coretimeInfo, chainName, lastCommittedTimeslice ?? 0, value));
    }
  }

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
      <ResponsiveGrid>
        {phaseName &&
          <Cores
            phaseName={phaseName}
            salesInfo={coretimeInfo?.salesInfo}
          />}
        {saleParams?.regionForSale && <Region regionForSale={saleParams.regionForSale} />}
        {phaseName && coretimeInfo &&
          <Timeline
            coretimeInfo={coretimeInfo}
            phaseName={phaseName}
            saleParams={saleParams}
          />}
        <div style={{ backgroundColor: 'white', borderRadius: '4px', gridColumn: '1 / -1', justifySelf: 'center', padding: '24px', width: '100%' }}>
          <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Sale information</p>
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
            {saleParams &&
              <SaleDetailsView
                chainName={chainName}
                chosenSaleNumber={chosenSaleNumber}
                saleParams={selectedSaleParams}
              />}
          </div>
        </div>
      </ResponsiveGrid>
    </div>
  );
}

export default Sale;
