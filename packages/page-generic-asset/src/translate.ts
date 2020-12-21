// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseTranslationResponse } from 'react-i18next';

import { useTranslation as useTranslationBase, withTranslation } from 'react-i18next';

export function useTranslation (): UseTranslationResponse<string> {
  return useTranslationBase('app-generic-asset');
}

export default withTranslation(['app-generic-asset']);
