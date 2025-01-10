import { WhiteBox } from "../../WhiteBox.js";
import { formatNumber } from '@polkadot/util';

export const Region = ({ regionForSale }: { regionForSale: any }) => {
    return (
        <WhiteBox>
            <p style={{ fontSize: '14px', opacity: '0.8' }}>Region for sale</p>
            {regionForSale &&
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <p style={{ fontSize: '14px', marginBottom: '0.25rem' }}>date period</p>
                        <p style={{ fontSize: '20px' }}>{regionForSale.start.date} - {regionForSale.end.date}</p>
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                        <p style={{ marginBottom: '0.25rem' }}>relay chain blocks</p>
                        <p>{formatNumber(regionForSale.start.blocks)} - {formatNumber(regionForSale.end.blocks)}</p>
                    </div>

                </div>}
        </WhiteBox>
    )
}