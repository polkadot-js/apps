// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation as useTranslationBase, UseTranslationResponse, withTranslation } from 'react-i18next';

export function useTranslation (): UseTranslationResponse {
  return useTranslationBase('app-generic-asset');
}

export default withTranslation(['app-generic-asset']);
