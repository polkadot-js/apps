// Copyright 2017-2025 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation as useTranslationBase } from 'react-i18next';

export interface TOptions {
  ns?: string;
  replace?: Record<string, unknown>
}

interface Translation {
  t: (key: string, optionsOrText?: string | TOptions, options?: TOptions) => string
}

export function useTranslation (): Translation {
  return useTranslationBase('app-settings') as unknown as Translation;
}
