import { SummaryBox } from "@polkadot/react-components"

import { CardSummary } from "@polkadot/react-components"

import { ProgressBar } from "@polkadot/react-components"
import { ProgressBarSection } from "@polkadot/react-components/types";
import { CoretimeInformation } from "@polkadot/react-hooks/types";
import { formatBalance, formatNumber } from '@polkadot/util';
import { getSaleProgress } from "../../utils/sale.js";
import { WhiteBox } from "../../WhiteBox.js";
import { useMemo } from "react";

export const Timeline = ({ phaseName, saleParams, coretimeInfo: { salesInfo, status } }: { phaseName: string, saleParams: any, coretimeInfo: { salesInfo: CoretimeInformation['salesInfo'], status: CoretimeInformation['status'] } }) => {
    const progressValues = useMemo(() => saleParams && salesInfo.regionBegin &&
        getSaleProgress(
            status.lastTimeslice,
            saleParams.currentRegion.start.ts,
            saleParams.interlude.ts,
            saleParams.leadin.ts,
            salesInfo.regionBegin),
        [saleParams, status.lastTimeslice, salesInfo.regionBegin]);

    return (
        <WhiteBox>
            <p style={{ fontSize: '14px', opacity: '0.8' }}>Sale timeline</p>
            <SummaryBox>
                <section>
                    {phaseName && <>
                        <CardSummary label='current phase'>{phaseName}</CardSummary>
                        <CardSummary label='current phase end'>{saleParams?.phaseConfig?.config[phaseName].end.date}</CardSummary>
                        <CardSummary label='last phase block'>{formatNumber(saleParams?.phaseConfig?.config[phaseName].end.blocks.relay)}</CardSummary>
                    </>}
                    <CardSummary label='fixed price'>{formatBalance(salesInfo.endPrice)}</CardSummary>
                </section>
                <section>

                </section>
            </SummaryBox>
            <ProgressBar sections={progressValues as ProgressBarSection[] ?? []} />
        </WhiteBox>
    )
}