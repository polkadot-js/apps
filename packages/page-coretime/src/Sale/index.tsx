// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainName, SaleDetails, SaleParameters } from '../types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Dropdown } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useCoretimeContext } from '../CoretimeContext.js';
import { useTranslation } from '../translate.js';
import { getSaleParameters } from '../utils/sale.js';
import Summary from './Summary.js';
import SaleDetailsView from './SaleDetailsView.js';
import { Cores } from './boxes/Cores.js';
import { Region } from './boxes/Region.js';
import { Timeline } from './boxes/Timeline.js';

interface Props {
  chainName: ChainName
}
function Sale({ chainName }: Props): React.ReactElement<Props> {
  const { coretimeInfo, get } = useCoretimeContext();
  const { api, isApiReady } = useApi();
  const { t } = useTranslation();
  const lastCommittedTimeslice = coretimeInfo?.status?.lastTimeslice;

  const saleParams = coretimeInfo && getSaleParameters(
    coretimeInfo,
    chainName,
    lastCommittedTimeslice ?? 0,
  );

  const phaseName = useMemo(() => saleParams?.phaseConfig?.currentPhaseName, [saleParams]);
  const [chosenSaleNumber, setChosenSaleNumber] = useState<number>(-1);
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

  useEffect(() => {
    if (saleNumberOptions.length > 1 && chosenSaleNumber === -1) {
      setChosenSaleNumber(saleNumberOptions[1].value);
    }
  }, [saleNumberOptions, chosenSaleNumber]);

  // TODO: uncomment when introducing core purchase functionality
  // const available = getAvailableNumberOfCores(coretimeInfo);

  const onDropDownChange = useCallback((value: number) => {
    setChosenSaleNumber(value);
    if (value !== -1) {
      if (!coretimeInfo) {
        return;
      }
      setSelectedSaleParams(getSaleParameters(coretimeInfo, chainName, lastCommittedTimeslice ?? 0, value))
    }
  }, [coretimeInfo, chainName, lastCommittedTimeslice]);

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

        {phaseName && <Cores salesInfo={coretimeInfo?.salesInfo} phaseName={phaseName} />}

        {saleParams?.regionForSale && <Region regionForSale={saleParams.regionForSale} />}

        {phaseName && coretimeInfo && <Timeline phaseName={phaseName} saleParams={saleParams} coretimeInfo={coretimeInfo} />}

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
            {saleParams && <SaleDetailsView saleParams={selectedSaleParams} chosenSaleNumber={chosenSaleNumber} chainName={chainName} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sale;
