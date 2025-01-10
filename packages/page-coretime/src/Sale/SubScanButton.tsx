import { Button } from "@polkadot/react-components"
import { useCallback } from "react";
import { constructSubscanQuery } from "../utils/index.js";
import { SaleParameters } from "../types.js";
import { useTranslation } from '../translate.js';

export const SubScanButton = ({ chosenSaleNumber, currentRegion, chainName }: { chosenSaleNumber: number, currentRegion: SaleParameters['currentRegion'], chainName: string }) => {
    const { t } = useTranslation();
    const onQuerySaleClick = useCallback(() => {
        if (currentRegion) {
            window.open(constructSubscanQuery(currentRegion.start.blocks.coretime, currentRegion.end.blocks.coretime, chainName));
        }
    }, [currentRegion, chainName]);

    if (chosenSaleNumber === -1 || !currentRegion) {
        return null;
    }

    return (
        <Button
            isBasic
            label={t(`Query Subscan for sale #${chosenSaleNumber + 1} transactions`)}
            onClick={onQuerySaleClick}
        />
    )

}