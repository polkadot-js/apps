// Copyright 2017-2022 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseTranslationResponse } from 'react-i18next';

import { useTranslation as useTranslationBase } from 'react-i18next';

export function useTranslation (): UseTranslationResponse<'app-addresses', undefined> {
  return useTranslationBase('app-addresses');
}
