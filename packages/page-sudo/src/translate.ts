// Copyright 2017-2022 @polkadot/app-sudo authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseTranslationResponse } from 'react-i18next';

import { useTranslation as useTranslationBase } from 'react-i18next';

export function useTranslation (): UseTranslationResponse<'app-sudo', undefined> {
  return useTranslationBase('app-sudo');
}
