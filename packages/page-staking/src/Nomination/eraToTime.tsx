import React, {useMemo} from 'react';
import {useApi} from '@polkadot/react-hooks/index';
import {useTranslation} from '@polkadot/app-accounts/translate';
import {BareProps} from "@polkadot/react-api/types";

function eraToTime({ className, style }: BareProps) {
  const { api } = useApi();
  const { t } = useTranslation();
  const bondedDuration = api.consts.staking.bondingDuration;

  // Attention! This is hardcode for Kusama
  const time = useMemo((): string => {
    const erasToHours = bondedDuration.toNumber() * 6;
    const days = Math.floor(erasToHours / 24);
    const hoursRemainder = erasToHours - days * 24;
    return [
      days ? (days > 1) ? t('{{d}} days', { replace: { d: days } }) : t('1 day') : null,
      hoursRemainder ? (hoursRemainder > 1) ? t('{{h}} hrs', { replace: { h: hoursRemainder } }) : t('1 hr') : null
    ].filter((value): value is string => !!value).slice(0, 2).join(' ');
  }, [api, t, bondedDuration]);

  return (
    <span
      className={className}
      style={style}
    >
      {time}
    </span>
  )
}

export default React.memo(eraToTime);
