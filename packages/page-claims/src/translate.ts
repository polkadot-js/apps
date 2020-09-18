// Copyright 2017-2020 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation as useTranslationBase, UseTranslationResponse, withTranslation } from 'react-i18next';

export function useTranslation (): UseTranslationResponse {
  return useTranslationBase('app-claims');
}

export default withTranslation(['app-claims']);
