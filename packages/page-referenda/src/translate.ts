// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseTranslationResponse } from 'react-i18next';

import { useTranslation as useTranslationBase } from 'react-i18next';

export function useTranslation (): UseTranslationResponse<'app-referenda', undefined> {
  return useTranslationBase('app-referenda');
}
