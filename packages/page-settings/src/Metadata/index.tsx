// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useTranslation } from '@polkadot/app-settings/translate';
import useCounter from '@polkadot/app-settings/useCounter';
import React, { useMemo } from 'react';

import Extensions from './Extensions';
import NetworkSpecs from './NetworkSpecs';

export default function Metadata (): React.ReactElement {
  const { t } = useTranslation();
  const numExtensions = useCounter();
  const extensionsTitle = useMemo(() => t('Extensions {{count}}', {
    replace: {
      count: numExtensions
        ? `(${numExtensions})`
        : ''
    }
  }), [numExtensions, t]);

  return (
    <>
      <h1>{extensionsTitle}</h1>
      <Extensions />
      <h1>{t('Chain Specifications as a QR Code')}</h1>
      <NetworkSpecs />
    </>
  );
}
