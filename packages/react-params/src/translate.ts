// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';

import { useTranslation as useTranslationBase, withTranslation } from 'react-i18next';

export function useTranslation (): { t: (key: string, options?: { replace: Record<string, unknown> }) => string } {
  return useTranslationBase('react-params');
}

export default function translate <T, P = Omit<T, 't'>> (C: React.ComponentClass<T>): React.ComponentType<P> {
  return withTranslation(['react-params'])(C) as unknown as React.ComponentType<P>;
}
