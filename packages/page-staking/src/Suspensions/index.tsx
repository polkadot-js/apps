// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import CurrentList from '@polkadot/app-staking/Suspensions/CurrentList';
import { MarkWarning } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import useSuspensions from './Suspensions';

export interface SuspensionEvent {
  address: string;
  era: number;
  suspensionReason: string;
  suspensionLiftsInEra: number;
}

function SuspensionsPage (): React.ReactElement {
  const { api } = useApi();
  const suspensions = useSuspensions();

  if (!api.runtimeChain.toString().includes('Aleph Zero')) {
    return (
      <MarkWarning content={'Unsupported chain.'} />
    );
  }

  return (
    <section>
      <CurrentList
        suspensions={suspensions}
      />
    </section>
  );
}

export default React.memo(SuspensionsPage);
