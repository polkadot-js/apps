// Copyright 2017-2022 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseTranslationResponse } from 'react-i18next';

import { useTranslation as useTranslationBase, withTranslation } from 'react-i18next';

export function useTranslation (): UseTranslationResponse<'app-claims', undefined> {
  return useTranslationBase('app-claims');
}

export default withTranslation(['app-claims']);
