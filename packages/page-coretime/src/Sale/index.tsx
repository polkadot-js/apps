// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProgressBarSection } from '@polkadot/react-components/types';
import type { BlockNumber } from '@polkadot/types/interfaces';
import type { ChainName, SaleDetails } from '../types.js';

import React, { useCallback, useMemo, useState } from 'react';

import { Button, CardSummary, Dropdown, SummaryBox } from '@polkadot/react-components';
import ProgressBar from '@polkadot/react-components/ProgressBar';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance, formatNumber } from '@polkadot/util';

import { PhaseName } from '../constants.js';
import { useCoretimeContext } from '../CoretimeContext.js';
import { useTranslation } from '../translate.js';
import { constructSubscanQuery, estimateTime } from '../utils/index.js';
import { calculateSaleDetails, getCorePriceAt, getSaleParameters, getSaleProgress } from '../utils/sale.js';
import SaleTable from './SaleTable.js';
import Summary from './Summary.js';

interface Props {
  chainName: ChainName
}

function Sale ({ chainName }: Props): React.ReactElement<Props> {
  const { coretimeInfo, get } = useCoretimeContext();
  const { api, apiCoretime, isApiReady } = useApi();
  const { t } = useTranslation();
  const regionBegin = coretimeInfo?.salesInfo?.regionBegin;
  const lastCommittedTimeslice = coretimeInfo?.status?.lastTimeslice;
  const bestNumberFinalized = useCall<BlockNumber>(apiCoretime.derive.chain.bestNumberFinalized);

  const coretimePrice = useMemo(() => get && bestNumberFinalized && getCorePriceAt(bestNumberFinalized.toNumber(), coretimeInfo?.salesInfo), [coretimeInfo?.salesInfo, get, bestNumberFinalized]);
  const saleParams = coretimeInfo && getSaleParameters(coretimeInfo.salesInfo, coretimeInfo.config, chainName, lastCommittedTimeslice ?? 0, coretimeInfo.constants);
  const phaseName = useMemo(() => saleParams?.phaseConfig?.currentPhaseName, [saleParams]);
  const [chosenSaleNumber, setChosenSaleNumber] = useState<number>(-1);
  const [saleDetails, setSaleDetails] = useState<SaleDetails | null>(null);
  const saleNumberOptions = useMemo(() =>
    [
      {
        text: t('Pick a sale number'),
        value: -1
      },
      ...Array.from({ length: saleParams?.cycleNumber ?? 0 }, (_, i) => ({
        text: `sale #${i + 1}`,
        value: i
      })).reverse()

    ]
  , [saleParams, t]);

  const progressValues = useMemo(() => saleParams && regionBegin && getSaleProgress(lastCommittedTimeslice, saleParams.currentRegion.start.ts, saleParams.interlude.ts, saleParams.leadin.ts, regionBegin),
    [saleParams, lastCommittedTimeslice, regionBegin]);

  // TODO: uncomment when introducing core purchase functionality
  // const available = getAvailableNumberOfCores(coretimeInfo);

  const onDropDownChange = useCallback((value: number) => {
    setChosenSaleNumber(value);

    if (value === -1) {
      setSaleDetails(null);
    } else {
      get && saleParams && setSaleDetails(calculateSaleDetails(
        value,
        saleParams?.cycleNumber,
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
                  cycleNumber={saleParams?.cycleNumber}
                  region={coretimeInfo?.region}
                  saleInfo={coretimeInfo?.salesInfo}
                  status={coretimeInfo?.status}
                />}
      <div style={{ alignItems: 'stretch', display: 'grid', flexFlow: '1', gap: '2rem', gridTemplateColumns: '1fr 3fr', gridTemplateRows: 'auto auto', marginTop: '4rem' }}>

        <div style={{ backgroundColor: 'white', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyItems: 'center', justifySelf: 'right', padding: '24px', width: 'fit-content' }}>
          <SummaryBox className='isSmall'>
            {phaseName === PhaseName.Renewals
              ? (
                <b>Cores cannot be purchased now</b>
              )
              : (
                <CardSummary label='current price'>{coretimePrice && formatBalance(coretimePrice)}</CardSummary>
              )}

          </SummaryBox>
          {/* TODO: Add core purchase functionality */}
          {/* {<div style={{ marginTop: '8px' }}>
                        <Button
                            isBasic
                            isDisabled={!available || phaseName === PhaseName.Renewals}
                            label={t('Purchase a core')}
                            onClick={() => window.alert('yo')}
                        />
                    </div>} */}
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '4px', justifySelf: 'left', padding: '24px', width: 'fit-content' }}>
          <SummaryBox>
            <section>
              {phaseName && <>
                <CardSummary label='current phase'>{phaseName}</CardSummary>
                <CardSummary label='current phase end'>{get && coretimeInfo && saleParams?.phaseConfig && estimateTime(saleParams.phaseConfig.config[phaseName].lastTimeslice, get.blocks.relay(coretimeInfo?.status.lastTimeslice), coretimeInfo.constants.relay)}</CardSummary>
                <CardSummary label='last block'>{formatNumber(saleParams?.phaseConfig?.config[phaseName].lastBlock)}</CardSummary>
              </>}
              <CardSummary label='fixed price'>{formatBalance(coretimeInfo?.salesInfo.endPrice)}</CardSummary>
            </section>
            <section>

            </section>
          </SummaryBox>
          <ProgressBar sections={progressValues as ProgressBarSection[] ?? []} />
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '4px', gridColumn: '1 / -1', justifySelf: 'center', padding: '24px', width: '100%' }}>
          <h2>Interlude + sale data</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxWidth: '300px' }}>
              <Dropdown
                className='isSmall'
                onChange={onDropDownChange}
                options={saleNumberOptions}
                value={chosenSaleNumber}
              />

            </div>
            {chosenSaleNumber > -1 && !!saleDetails && <div style={{ minWidth: '200px' }}>
              <SaleTable
                saleDetails={saleDetails}
              />

            </div>}
            {chosenSaleNumber > -1 && !!saleDetails && <div style={{ minWidth: '200px' }}>
              <h2>Query sale transactions</h2>
              <p style={{ marginTop: '1rem' }}>We do not index transactions ourselves but you can query historical transactions on Subscan. <br />
                                The button below will open a new tab with the correct query parameters for the chosen sale.</p>
              <Button
                isBasic
                label={t(`Query Subscan for sale #${chosenSaleNumber + 1}`)}
                onClick={onQuerySaleClick}
              />
            </div>

            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sale;
