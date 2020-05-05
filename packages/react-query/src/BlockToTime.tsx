// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

interface Props extends BareProps {
  blocks?: BN;
  children?: React.ReactNode;
  label?: React.ReactNode;
}

type Time = [number, number, number, number];

const HRS = 60 * 60;
const DAY = HRS * 24;
const DEFAULT_TIME = new BN(6000);

function addTime (a: Time, b: Time): Time {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
}

function extractTime (value?: number): Time {
  if (!value) {
    return [0, 0, 0, 0];
  } else if (value < 60) {
    return [0, 0, 0, value];
  }

  const mins = value / 60;

  if (mins < 60) {
    const round = Math.floor(mins);

    return addTime([0, 0, round, 0], extractTime(value - (round * 60)));
  }

  const hrs = mins / 60;

  if (hrs < 24) {
    const round = Math.floor(hrs);

    return addTime([0, round, 0, 0], extractTime(value - (round * HRS)));
  }

  const round = Math.floor(hrs / 24);

  return addTime([round, 0, 0, 0], extractTime(value - (round * DAY)));
}

function BlockToTime ({ blocks, children, className, label, style }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const time = useMemo((): string => {
    const blockTime = (
      api.consts.babe?.expectedBlockTime ||
      api.consts.timestamp?.minimumPeriod.muln(2) ||
      DEFAULT_TIME
    ).divn(1000);
    const time = extractTime(blocks?.mul(blockTime).toNumber());

    return [
      time[0] ? (time[0] > 1) ? t('{{d}} days', { replace: { d: time[0] } }) : t('1 day') : null,
      time[1] ? (time[1] > 1) ? t('{{h}} hrs', { replace: { h: time[1] } }) : t('1 hr') : null,
      time[2] ? (time[2] > 1) ? t('{{m}} mins', { replace: { m: time[2] } }) : t('1 min') : null,
      time[3] ? (time[3] > 1) ? t('{{s}} s', { replace: { s: time[3] } }) : t('1 s') : null
    ].filter((value): value is string => !!value).slice(0, 2).join(' ');
  }, [api, blocks, t]);

  if (blocks?.ltn(0)) {
    return null;
  }

  return (
    <div
      className={className}
      style={style}
    >
      {label || ''}{time}{children}
    </div>
  );
}

export default React.memo(BlockToTime);
