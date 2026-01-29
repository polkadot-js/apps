// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RelayName, SaleParameters } from '../types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Dropdown, styled } from '@polkadot/react-components';
import { defaultHighlight } from '@polkadot/react-components/styles';
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
  relayName: RelayName
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

function Sale ({ relayName }: Props): React.ReactElement<Props> {
  const { coretimeInfo } = useCoretimeContext();
  const { api, apiEndpoint, isApiReady } = useApi();
  const { t } = useTranslation();
  const lastCommittedTimeslice = coretimeInfo?.status?.lastTimeslice;
  const [chosenSaleNumber, setChosenSaleNumber] = useState<number>(-1);
  const [saleParams, setSaleParams] = useState<SaleParameters | null>(null);
  const [selectedSaleParams, setSelectedSaleParams] = useState<SaleParameters | null>(null);
  const apiColor = apiEndpoint?.ui.color || defaultHighlight;

  const saleNumberOptions = useMemo(() => [
    {
      text: t('Pick a sale number'),
      value: -1
    },
    ...Array.from({ length: saleParams?.saleNumber ?? 0 }, (_, i) => ({
      text: `sale #${i + 1}`,
      value: i
    })).reverse()
  ], [saleParams?.saleNumber, t]);

  useEffect(() => {
    if (coretimeInfo && !saleParams) {
      setSaleParams(getSaleParameters(
        coretimeInfo,
        relayName,
        lastCommittedTimeslice ?? 0
      ));
    }
  }, [coretimeInfo, saleParams, lastCommittedTimeslice, relayName]);

  const phaseName = useMemo(() => saleParams?.phaseConfig?.currentPhaseName, [saleParams]);

  const onDropDownChange = useCallback((value: number) => {
    setChosenSaleNumber(value);

    if (value !== -1) {
      if (!coretimeInfo) {
        return;
      }

      setSelectedSaleParams(getSaleParameters(coretimeInfo, relayName, lastCommittedTimeslice ?? 0, value));
    }
  }, [coretimeInfo, relayName, lastCommittedTimeslice]);

  return (
    <div>
      {coretimeInfo && !!saleParams?.saleNumber &&
        <Summary
          api={isApiReady ? api : null}
          config={coretimeInfo?.config}
          region={coretimeInfo?.region}
          saleInfo={coretimeInfo?.salesInfo}
          saleNumber={saleParams?.saleNumber}
          status={coretimeInfo?.status}
        />}
      <ResponsiveGrid>
        {phaseName && coretimeInfo &&
          <Cores
            color={apiColor}
            phaseName={phaseName}
            salesInfo={coretimeInfo?.salesInfo}
          />}
        {saleParams?.regionForSale && <Region regionForSale={saleParams.regionForSale} />}
        {phaseName && coretimeInfo && saleParams &&
          <Timeline
            color={apiColor}
            coretimeInfo={coretimeInfo}
            phaseName={phaseName}
            saleParams={saleParams}
          />}
        <div style={{ borderRadius: '4px', gridColumn: '1 / -1', justifySelf: 'center', padding: '24px', width: '100%' }}>
          <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>{t('Sale information')}</p>
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
            {saleParams && selectedSaleParams &&
              <SaleDetailsView
                chosenSaleNumber={chosenSaleNumber}
                relayName={relayName}
                saleParams={selectedSaleParams}
              />}
          </div>
        </div>
      </ResponsiveGrid>
    </div>
  );
}

export default Sale;
