// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UseTranslationResponse } from 'react-i18next';

import { useTranslation as useTranslationBase } from 'react-i18next';

<<<<<<< HEAD
export function useTranslation (): UseTranslationResponse<'app-tech-comm'> {
  return useTranslationBase('app-tech-comm');
=======
export function useTranslation(): UseTranslationResponse<'app-root-comm'> {
  return useTranslationBase('app-root-comm');
>>>>>>> ternoa-master
}
