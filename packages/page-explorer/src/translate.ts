// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation as useTranslationBase, UseTranslationResponse } from 'react-i18next';

export function useTranslation (): UseTranslationResponse {
  return useTranslationBase('app-explorer');
}
