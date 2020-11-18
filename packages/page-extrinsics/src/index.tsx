// Copyright 2017-2020 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Tabs } from '@polkadot/react-components';

import Selection from './Selection';
import { useTranslation } from './translate';

function ExtrinsicsTabs ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([{
    isRoot: true,
    name: 'create',
    text: t<string>('Extrinsic submission')
  }]);

  return (
    <Tabs
      basePath={basePath}
      items={itemsRef.current}
    />
  );
}

function ExtrinsicsApp (): React.ReactElement<Props> {
  return (
    <Selection />
  );
}

export const Component = React.memo(ExtrinsicsApp);
export const TabsComponent = React.memo(ExtrinsicsTabs);
