// Copyright 2017-2021 @polkadot/react-query authors & contributors
// and @canvas-ui/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseTranslationResponse } from 'react-i18next';

import { useTranslation as useTranslationBase } from 'react-i18next';

export function useTranslation (): UseTranslationResponse<'react-query'> {
  return useTranslationBase('react-query');
}
