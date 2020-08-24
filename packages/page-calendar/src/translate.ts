// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useTranslation as useTranslationBase, UseTranslationResponse } from 'react-i18next';
import { TFunction } from 'i18next';

export const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function translateDays (t: TFunction): string[] {
  return DAYS.map((d) => t(d));
}

export function translateMonths (t: TFunction): string[] {
  return MONTHS.map((m) => t(m));
}

export function useTranslation (): UseTranslationResponse {
  return useTranslationBase('app-calendar');
}
