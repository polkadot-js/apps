// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { TFunction } from 'i18next';
import { Time } from '@polkadot/util/types';

export default function timeToString (t: TFunction, { days, hours, minutes, seconds }: Time): string {
  return [
    days ? (days > 1) ? t<string>('{{days}} days', { replace: { days } }) : t('1 day') : null,
    hours ? (hours > 1) ? t<string>('{{hours}} hrs', { replace: { hours } }) : t('1 hr') : null,
    minutes ? (minutes > 1) ? t<string>('{{minutes}} mins', { replace: { minutes } }) : t('1 min') : null,
    seconds ? (seconds > 1) ? t<string>('{{seconds}} s', { replace: { seconds } }) : t('1 s') : null
  ]
    .filter((value): value is string => !!value)
    .slice(0, 2)
    .join(' ');
}
