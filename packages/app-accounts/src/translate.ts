// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  withTranslation,
  useTranslation as _useTranslation,
  UseTranslationResponse
} from 'react-i18next';

export function useTranslation (): UseTranslationResponse {
  return _useTranslation('app-accounts');
}

export default withTranslation(['app-accounts']);
