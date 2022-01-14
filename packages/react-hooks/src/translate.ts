// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseTranslationResponse } from 'react-i18next';

import { useTranslation as useTranslationBase, withTranslation } from 'react-i18next';

export function useTranslation (): UseTranslationResponse<'react-hooks', undefined> {
  return useTranslationBase('react-hooks');
}

export default withTranslation(['react-hooks']);
