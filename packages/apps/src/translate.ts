// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation as useTranslationBase } from 'react-i18next';

interface TOptions {
  ns?: string;
  replace?: Record<string, unknown>;
}

export function useTranslation (): { t: (key: string, optionsOrText?: string | TOptions, options?: TOptions) => string } {
  return useTranslationBase('apps');
}
