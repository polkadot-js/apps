// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import useChainInfo from '../useChainInfo';
import Extensions from './Extensions';
import NetworkSpecs from './NetworkSpecs';

export default function Metadata (): React.ReactElement {
  const { t } = useTranslation();
  const { isDevelopment } = useApi();
  const chainInfo = useChainInfo();

  return (
    <>
      {!isDevelopment && (
        <>
          <h1>{t<string>('Extensions')}</h1>
          <Extensions chainInfo={chainInfo} />
        </>
      )}
      <h1>{t<string>('Chain specifications')}</h1>
      <NetworkSpecs chainInfo={chainInfo} />
    </>
  );
}
