// Copyright 2017-2021 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseTranslationResponse } from 'react-i18next';

import { useTranslation as useTranslationBase } from 'react-i18next';

export function useTranslation (): UseTranslationResponse<'app-execute'> {
  return useTranslationBase('app-execute');
}
