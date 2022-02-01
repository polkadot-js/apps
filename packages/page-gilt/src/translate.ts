// Copyright 2017-2022 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseTranslationResponse } from 'react-i18next';

import { useTranslation as useTranslationBase } from 'react-i18next';

export function useTranslation (): UseTranslationResponse<'app-gilt', undefined> {
  return useTranslationBase('app-gilt');
}
