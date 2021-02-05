// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import styled from 'styled-components';

import { Tabs } from '@polkadot/react-components';

import Overview from './Overview';
import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
}

function CrowdloanApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const items = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    }
  ]);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          items={items.current}
        />
      </header>
      <Overview />
    </main>
  );
}

export default React.memo(styled(CrowdloanApp)``);
