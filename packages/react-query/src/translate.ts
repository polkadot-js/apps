// Copyright 2017-2023 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation as useTranslationBase, withTranslation } from 'react-i18next';

export function useTranslation (): { t: (key: string, options?: { replace: Record<string, unknown> }) => string } {
  return useTranslationBase('react-query');
}

export default withTranslation(['react-query']);
