// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import useChainInfo from '../useChainInfo';

import { useTranslation } from '../translate';
import Extensions from './Extensions';
import NetworkSpecs from './NetworkSpecs';

export default function Metadata (): React.ReactElement {
  const { t } = useTranslation();
  const chainInfo = useChainInfo();

  return (
    <>
      <h1>{t<string>('Extensions')}</h1>
      <Extensions chainInfo={chainInfo} />
      <h1>{t<string>('Chain specifications')}</h1>
      <NetworkSpecs chainInfo={chainInfo} />
    </>
  );
}
