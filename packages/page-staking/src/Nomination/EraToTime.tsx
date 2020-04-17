import React from 'react';
import { useApi} from '@polkadot/react-hooks';
import { useTranslation} from '@polkadot/app-accounts/translate';
import { BareProps} from "@polkadot/react-api/types";
import { BlockToTime} from "@polkadot/react-query";
import { formatNumber } from '@polkadot/util';

interface EraToTimeInterface extends BareProps{
  showBlocks?: boolean;
  showDays?: boolean;
}

function EraToTime({ className, style, showBlocks, showDays }: EraToTimeInterface) {
  const { api } = useApi();
  const { t } = useTranslation();
  const bondedDuration = api.consts.staking.bondingDuration;
  const epochDuration = api.consts.babe.epochDuration;
  const genesisSlot = api.query.babe.genesisSlot;
  let eraLength = null;

  // works only if we have epoch (genesisSlot is not null)
  if (genesisSlot) {
    const sessionsPerEra = api.consts.staking.sessionsPerEra;
    eraLength = sessionsPerEra.mul(epochDuration).mul(bondedDuration);
  }

  if (!eraLength) {
    return null;
  }

  return (
    <span
      className={className}
      style={style}
    >
      <BlockToTime
        style={{ display: 'inline' }}
        blocks={showDays ? eraLength : undefined}
        label={`${showBlocks ? t('{{blocks}} blocks', { replace: { blocks: formatNumber(eraLength) } }) : ''}${showBlocks && showDays ? ', ' : ''}`}
      />
    </span>
  )
}

export default React.memo(EraToTime);
