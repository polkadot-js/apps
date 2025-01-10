import { PhaseName } from "../../constants.js";
import { getCorePriceAt } from "../../utils/sale.js";
import { WhiteBox } from "../../WhiteBox.js";
import { useTranslation } from '../../translate.js';
import { useCall, useApi } from "@polkadot/react-hooks";
import type { BlockNumber } from '@polkadot/types/interfaces';
import React, { useMemo } from 'react';
import { formatBalance, } from '@polkadot/util';


export const Cores = ({ phaseName, salesInfo }: { phaseName: string, salesInfo: any }) => {
    const { t } = useTranslation();
    const { apiCoretime } = useApi();
    const bestNumberFinalized = useCall<BlockNumber>(apiCoretime?.derive.chain.bestNumberFinalized);
    const soldOut = useMemo(() => salesInfo.coresOffered === salesInfo.coresSold, [salesInfo.coresOffered, salesInfo.coresSold]);
    const coretimePrice = useMemo(() => bestNumberFinalized && getCorePriceAt(bestNumberFinalized.toNumber(), salesInfo), [salesInfo, bestNumberFinalized]);

    return (
        <WhiteBox>
            <p style={{ fontSize: '14px', opacity: '0.8' }}>Cores sale</p>
            {phaseName === PhaseName.Renewals
                ? (
                    <h4>{t('Cores cannot be purchased now')}</h4>
                )
                : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {soldOut && (
                            <h4>{t('All cores are sold out')}</h4>
                        )}
                        {!soldOut && (
                            <div>
                                <p style={{ fontSize: '14px', marginBottom: '0.25rem' }}>{t('current price')}</p>
                                <p style={{ fontSize: '20px' }}> {coretimePrice && formatBalance(coretimePrice)}</p>
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
        </WhiteBox>
    )
};
