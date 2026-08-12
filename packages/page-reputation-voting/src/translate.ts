// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation as useTranslationBase } from 'react-i18next';

export function useTranslation (): ReturnType<typeof useTranslationBase> {
  return useTranslationBase('app-reputation-voting');
}
