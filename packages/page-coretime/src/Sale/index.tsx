// [object Object]
// SPDX-License-Identifier: Apache-2.0

import type { CoretimeInformation } from '@polkadot/react-hooks/types';

import { useCallback, useMemo, useState } from 'react';

import { Button, CardSummary, Dropdown, Input, SummaryBox, Table } from '@polkadot/react-components';
import ProgresBar from '@polkadot/react-components/ProgresBar';
import { useApi } from '@polkadot/react-hooks';
import { CoreTimeChainConsts } from '@polkadot/react-hooks/types';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import { PhaseName } from '../types.js';
import { calculateSaleDetails, constructSubscanQuery, estimateTime, getCurrentSaleNumber, getRegionStartEndTs } from '../utils.js';
import SaleTable from './SaleTable.js';
import Summary from './Summary.js';

interface Props {
  coretimeInfo: CoretimeInformation
  chainName: string
}

function Sale ({ chainName, coretimeInfo }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const { t } = useTranslation();
  const [saleNumber, setSaleNumber] = useState<number>(-1);
  const [saleDetails, setSaleDetails] = useState();

  const { config: { interludeLength, leadinLength },
    salesInfo: { regionBegin },
    status: { lastCommittedTimeslice } } = coretimeInfo;

  const interludeLengthTs = interludeLength / CoreTimeChainConsts.BlocksPerTimeslice;
  const leadInLengthTs = leadinLength / CoreTimeChainConsts.BlocksPerTimeslice;
  const { currentRegionEnd, currentRegionStart } = getRegionStartEndTs(coretimeInfo.salesInfo, coretimeInfo.config);

  const cycleNumber = useMemo(() =>
    chainName && getCurrentSaleNumber(currentRegionEnd, chainName, coretimeInfo.config)
  , [currentRegionEnd, chainName, coretimeInfo.config]);

  const phaseConfig = useMemo(() => {
    if (!coretimeInfo?.blockTimeMs) {
      return undefined;
    }

    return {
      [PhaseName.Renewals]: {
        lastTimeslice: currentRegionStart + interludeLengthTs,
        lastBlock: (currentRegionStart + interludeLengthTs) * 80
      },
      [PhaseName.PriceDiscovery]: {
        lastTimeslice: currentRegionStart + interludeLengthTs + leadInLengthTs,
        lastBlock: (currentRegionStart + interludeLengthTs + leadInLengthTs) * 80
      },
      [PhaseName.FixedPrice]: {
        lastTimeslice: regionBegin,
        lastBlock: regionBegin * 80
      }
    };
  }, [coretimeInfo]);

  const currentPhase = useMemo(() => {
    const progress = lastCommittedTimeslice - currentRegionStart;

    if (progress < interludeLengthTs) {
      return PhaseName.Renewals;
    }

    if (progress < interludeLengthTs + leadInLengthTs) {
      return PhaseName.PriceDiscovery;
    }

    return PhaseName.FixedPrice;
  }, [interludeLengthTs, leadInLengthTs]);

  const progressValues = useMemo(() => {
    const progress = lastCommittedTimeslice - currentRegionStart;

    return [
      {
        value: Math.min(progress, interludeLengthTs),
        total: interludeLengthTs,
        label: PhaseName.Renewals
      },
      {
        value: Math.min(Math.max(progress - interludeLengthTs, 0), leadInLengthTs),
        total: leadInLengthTs,
        label: PhaseName.PriceDiscovery
      },
      {
        value: Math.max(progress - interludeLengthTs - leadInLengthTs, 0),
        total: regionBegin - currentRegionStart - interludeLengthTs - leadInLengthTs,
        label: PhaseName.FixedPrice
      }
    ];
  }, [interludeLengthTs, leadInLengthTs, lastCommittedTimeslice, currentRegionStart, regionBegin]);

  const available = Number(coretimeInfo?.salesInfo?.coresOffered) - Number(coretimeInfo?.salesInfo.coresSold);

  const onDropDownChange = useCallback((v: number) => {
    console.log(v);
    setSaleNumber(v);
    const details = calculateSaleDetails(v, cycleNumber, currentRegionStart, coretimeInfo.status.lastTimeslice * 80, chainName);

    setSaleDetails(details);
  }, []);

  return (
    <div>
      {coretimeInfo &&
                <Summary
                  api={isApiReady ? api : null}
                  config={coretimeInfo?.config}
                  cycleNumber={cycleNumber}
                  region={coretimeInfo?.region}
                  saleInfo={coretimeInfo?.salesInfo}
                  status={coretimeInfo?.status}
                />}
      <div style={{ marginTop: '4rem', display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 3fr', gridTemplateRows: 'auto auto', alignItems: 'stretch', flexFlow: '1' }}>

        <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', justifySelf: 'right', backgroundColor: 'white', borderRadius: '4px', padding: '24px', width: 'fit-content' }}>
          <SummaryBox>
            <CardSummary label='current price'>100 DOT</CardSummary>
            {/* {!!available && <CardSummary label="cores avaiable">{available}</CardSummary>}
                        {!available && <p style={{ fontSize: '12px' }}> Currently there are no cores available for purchase</p>} */}

          </SummaryBox>
          {!!available && <div style={{ marginTop: '8px' }}>
            <Button
              isBasic
              isDisabled={!available}
              label={t('Purchase a core')}
              onClick={() => window.alert('yo')}
            />
          </div>}
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '24px', width: 'fit-content', justifySelf: 'left' }}>
          <SummaryBox>
            <section>
              <CardSummary label='current phase'>{currentPhase && currentPhase}</CardSummary>
              <CardSummary label='current phase end'>{currentPhase && phaseConfig && estimateTime(phaseConfig[currentPhase].lastTimeslice, coretimeInfo.status.lastTimeslice * 80)}</CardSummary>
              <CardSummary label='last block'>{currentPhase && phaseConfig?.[currentPhase].lastBlock}</CardSummary>
              <CardSummary label='fixed price'>{formatNumber(coretimeInfo?.salesInfo.endPrice)}</CardSummary>
              <CardSummary label='sellout price'>{formatNumber(coretimeInfo?.salesInfo.selloutPrice)}</CardSummary>
            </section>
            <section>

            </section>
          </SummaryBox>
          <ProgresBar sections={progressValues} />
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '24px', justifySelf: 'center', gridColumn: '1 / -1', width: '100%' }}>
          <h2>Historical data</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxWidth: '300px' }}>

              <Dropdown
                className='isSmall'
                // label={t('sale number')}
                onChange={onDropDownChange}
                options={[
                  {
                    text: t('Pick a sale number'),
                    value: -1
                  },
                  ...Array.from({ length: cycleNumber + 1 }, (_, i) => ({
                    text: `sale #${i}`,
                    value: i
                  })).reverse()
                ]}
                value={-1}
              />

            </div>
            {saleNumber > -1 && !!saleDetails && <div style={{ minWidth: '200px' }}>
              <SaleTable
                saleDetails={saleDetails}
                saleNumber={saleNumber}
              />

            </div>}
            {saleNumber > -1 && !!saleDetails && <div style={{ minWidth: '200px' }}>
              <Button
                isBasic
                label={t('Query Subscan')}
                onClick={() => {
                  if (saleDetails) {
                    window.open(constructSubscanQuery(saleDetails.coretime.startBlock, saleDetails.coretime.endBlock));
                  } else {
                    // error message
                  }
                }}
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
