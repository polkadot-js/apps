// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoretimeInformation } from '@polkadot/react-hooks/types';

import React, { useCallback, useMemo, useState } from 'react';

import { Button, CardSummary, Dropdown, SummaryBox } from '@polkadot/react-components';
import ProgresBar from '@polkadot/react-components/ProgresBar';
import { useApi } from '@polkadot/react-hooks';
import { formatBalance, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import { type ChainName, PhaseName } from '../types.js';
import { calculateSaleDetails, constructSubscanQuery, getSaleParameters, getSaleProgress } from '../utils.js';
import { estimateTime } from '../utils/index.js';
import { getCorePriceAt } from '../utils/sale.js';
import SaleTable from './SaleTable.js';
import Summary from './Summary.js';

interface Props {
  coretimeInfo: CoretimeInformation
  chainName: ChainName
}

function Sale ({ chainName, coretimeInfo }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const { t } = useTranslation();
  const { salesInfo: { regionBegin },
    status: { lastCommittedTimeslice } } = coretimeInfo;

  const coretimePrice = useMemo(() => getCorePriceAt(lastCommittedTimeslice * 80, coretimeInfo.salesInfo), [lastCommittedTimeslice, coretimeInfo.salesInfo]);
  const saleParams = coretimeInfo && getSaleParameters(coretimeInfo.salesInfo, coretimeInfo.config, chainName, lastCommittedTimeslice);
  const phaseName = useMemo(() => saleParams?.phaseConfig?.currentPhaseName, [saleParams]);
  const [chosenSaleNumber, setChosenSaleNumber] = useState<number>(-1);
  const saleNumberOptions = useMemo(() =>
    [
      {
        text: t('Pick a sale number'),
        value: -1
      },
      ...Array.from({ length: saleParams?.cycleNumber }, (_, i) => ({
        text: `sale #${i + 1}`,
        value: i
      })).reverse()

    ]
  , [saleParams, t]);

  const saleDetails = useMemo(() => chosenSaleNumber !== -1 ? calculateSaleDetails(chosenSaleNumber, saleParams?.cycleNumber, coretimeInfo.status.lastTimeslice * 80, chainName, coretimeInfo.config.regionLength, saleParams) : null, [chosenSaleNumber, saleParams, coretimeInfo, chainName]);
  const progressValues = useMemo(() => getSaleProgress(lastCommittedTimeslice, saleParams.currentRegion.start.ts, saleParams.interlude.ts, saleParams.leadin.ts, regionBegin),
    [saleParams, lastCommittedTimeslice, regionBegin]);

  // TODO: uncomment when introducing core purchase functionality
  // const available = getAvailableNumberOfCores(coretimeInfo);

  const onDropDownChange = useCallback((value: number) => {
    setChosenSaleNumber(value);
  }, []);

  const onQuerySaleClick = useCallback(() => {
    if (saleDetails) {
      window.open(constructSubscanQuery(saleDetails.coretime.start.block, saleDetails.coretime.end.block, chainName));
    }
  }, [saleDetails, chainName]);

  return (
    <div>
      {coretimeInfo &&
                <Summary
                  api={isApiReady ? api : null}
                  config={coretimeInfo?.config}
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
                <CardSummary label='current price'>{formatBalance(coretimePrice)}</CardSummary>
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
              <CardSummary label='current phase'>{phaseName && phaseName}</CardSummary>
              <CardSummary label='current phase end'>{phaseName && saleParams?.phaseConfig && estimateTime(saleParams.phaseConfig.config[phaseName].lastTimeslice, coretimeInfo.status.lastTimeslice * 80)}</CardSummary>
              <CardSummary label='last block'>{phaseName && formatNumber(saleParams?.phaseConfig?.config[phaseName].lastBlock)}</CardSummary>
              <CardSummary label='fixed price'>{formatBalance(coretimeInfo?.salesInfo.endPrice)}</CardSummary>
              <CardSummary label='sellout price'>{formatBalance(coretimeInfo?.salesInfo.selloutPrice)}</CardSummary>
            </section>
            <section>

            </section>
          </SummaryBox>
          <ProgresBar sections={progressValues} />
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
