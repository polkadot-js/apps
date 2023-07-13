// Copyright 2017-2023 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation as useTranslationBase } from 'react-i18next';

export function useTranslation (): { t: (key: string, options?: { replace: Record<string, unknown> }) => string } {
  return useTranslationBase('app-democracy');
}
