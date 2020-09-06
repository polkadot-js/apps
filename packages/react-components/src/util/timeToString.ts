// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TFunction } from 'i18next';
import { Time } from '@polkadot/util/types';

export default function timeToString (t: TFunction, { days, hours, minutes, seconds }: Time): string {
  return [
    days ? (days > 1) ? t<string>('{{d}} days', { replace: { d: days } }) : t<string>('1 day') : null,
    hours ? (hours > 1) ? t<string>('{{h}} hrs', { replace: { h: hours } }) : t<string>('1 hr') : null,
    minutes ? (minutes > 1) ? t<string>('{{m}} mins', { replace: { m: minutes } }) : t<string>('1 min') : null,
    seconds ? (seconds > 1) ? t<string>('{{s}} s', { replace: { s: seconds } }) : t<string>('1 s') : null
  ]
    .filter((value): value is string => !!value)
    .slice(0, 2)
    .join(' ');
}
