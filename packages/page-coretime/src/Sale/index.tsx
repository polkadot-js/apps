import { useApi } from "@polkadot/react-hooks";
import Summary from "./Summary.js"
import { CoreTimeChainConsts, CoretimeInformation } from "@polkadot/react-hooks/types";
import { Button, CardSummary, SummaryBox } from "@polkadot/react-components";
import { useTranslation } from "../translate.js";
import { formatNumber } from '@polkadot/util';
import ProgresBar from "@polkadot/react-components/ProgresBar";
import { useMemo } from "react";
import { PhaseName } from "../types.js";
import { estimateTime } from "../utils.js";

interface Props {
    coretimeInfo: CoretimeInformation
}

function Sale({ coretimeInfo }: Props): React.ReactElement<Props> {
    const { api, isApiReady } = useApi();
    const { t } = useTranslation();
    const {
        salesInfo: { regionBegin },
        config: { regionLength, interludeLength, leadinLength },
        status: { lastCommittedTimeslice }
    } = coretimeInfo;

    const interludeLengthTs = interludeLength / CoreTimeChainConsts.BlocksPerTimeslice;
    const leadInLengthTs = leadinLength / CoreTimeChainConsts.BlocksPerTimeslice;
    const currentRegionStart = regionBegin - regionLength;

    const phaseConfig = useMemo(() => {
        if (!coretimeInfo || !coretimeInfo.blockTimeMs) {
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
        }
    }, [coretimeInfo])


    const currentPhase = useMemo(() => {
        const progress = lastCommittedTimeslice - currentRegionStart;
        if (progress < interludeLengthTs) {
            return PhaseName.Renewals
        }
        if (progress < interludeLengthTs + leadInLengthTs) {
            return PhaseName.PriceDiscovery;
        }
        return PhaseName.FixedPrice
    }, [interludeLengthTs, leadInLengthTs])

    console.log('currentPhase ', currentPhase)


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



    // const available = Number(coretimeInfo?.salesInfo?.coresOffered) - Number(coretimeInfo?.salesInfo.coresSold)
    const available = 1
    return (
        <div>
            {coretimeInfo &&
                <Summary
                    api={isApiReady ? api : null}
                    config={coretimeInfo?.config}
                    region={coretimeInfo?.region}
                    saleInfo={coretimeInfo?.salesInfo}
                    status={coretimeInfo?.status}
                />}
            <div style={{ marginTop: '4rem', display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 3fr', justifyItems: 'center', alignItems: 'stretch', flexFlow: '1' }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', justifySelf: 'right', backgroundColor: 'white', borderRadius: '4px', padding: '24px', width: 'fit-content' }}>
                    <SummaryBox>
                        <CardSummary label="current price">100 DOT</CardSummary>
                        {/* {!!available && <CardSummary label="cores avaiable">{available}</CardSummary>}
                        {!available && <p style={{ fontSize: '12px' }}> Currently there are no cores available for purchase</p>} */}

                    </SummaryBox>
                    {!!available && <div style={{ marginTop: '8px' }}>
                        <Button label={t('Purchase a core')} isBasic onClick={() => window.alert('yo')} isDisabled={!available} />
                    </div>}
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '24px', width: 'fit-content', justifySelf: 'left', }}>
                    <SummaryBox>
                        <section>
                            <CardSummary label="current phase">{currentPhase && currentPhase}</CardSummary>
                            <CardSummary label="current phase end">{currentPhase && phaseConfig && estimateTime(phaseConfig[currentPhase].lastTimeslice, coretimeInfo.status.lastTimeslice * 40)}</CardSummary>
                            <CardSummary label="last block">{currentPhase && phaseConfig && phaseConfig[currentPhase].lastBlock}</CardSummary>
                            <CardSummary label="fixed price">{formatNumber(coretimeInfo?.salesInfo.endPrice)}</CardSummary>
                            <CardSummary label="sellout price">{formatNumber(coretimeInfo?.salesInfo.selloutPrice)}</CardSummary>
                        </section>
                        <section>

                        </section>
                    </SummaryBox>
                    <ProgresBar sections={progressValues} />
                </div>
            </div>
        </div>
    )
}

export default Sale