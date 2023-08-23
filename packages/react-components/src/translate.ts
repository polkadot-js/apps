// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';

import { useTranslation as useTranslationBase, withTranslation } from 'react-i18next';

export function useTranslation (): { t: (key: string, options?: { replace: Record<string, unknown> }) => string } {
  return useTranslationBase('react-components');
}

export default function translate <T> (C: React.ComponentClass<T>): React.ComponentType<T> {
  return withTranslation(['react-components'])(C) as unknown as React.ComponentType<T>;
}
