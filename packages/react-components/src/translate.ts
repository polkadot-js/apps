// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation as useTranslationBase, withTranslation } from 'react-i18next';

export function useTranslation (): { t: (key: string, options?: { replace: Record<string, unknown> }) => string } {
  return useTranslationBase('react-components');
}

export default withTranslation(['react-components']);
