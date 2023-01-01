// Copyright 2017-2023 @polkadot/app-scheduler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import DispatchQueue from './DispatchQueue';
import Scheduler from './Scheduler';
import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
}

function App ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const tabs = useMemo(
    () => [
      {
        isRoot: true,
        name: 'overview',
        text: t<string>('Overview')
      }
    ],
    [t]
  );

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={tabs}
      />
      {api.query.democracy && (
        <DispatchQueue />
      )}
      {api.query.scheduler && (
        <Scheduler />
      )}
    </main>
  );
}

export default React.memo(App);
