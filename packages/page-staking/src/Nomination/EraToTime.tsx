import React from 'react';
import { useApi} from '@polkadot/react-hooks';
import { useTranslation} from '@polkadot/app-accounts/translate';
import { BareProps} from "@polkadot/react-api/types";
import { BlockToTime} from "@polkadot/react-query";
import { formatNumber } from '@polkadot/util';

function eraToTime({ className, style }: BareProps) {
  const { api } = useApi();
  const { t } = useTranslation();
  const bondedDuration = api.consts.staking.bondingDuration;
  const epochDuration = api.consts.babe.epochDuration;
  const genesisSlot = api.query.babe.genesisSlot;
  let eraLength = null;
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
        blocks={eraLength}
        label={`${t('{{blocks}} blocks', { replace: { blocks: formatNumber(eraLength) } })}, `}
      />
    </span>
  )
}

export default React.memo(eraToTime);
