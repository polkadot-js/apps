// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Decoder from './Decoder';
import Submission from './Submission';
import { useTranslation } from './translate';

function ExtrinsicsApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'create',
      text: t<string>('Submission')
    },
    {
      name: 'decode',
      text: t<string>('Decode')
    }
  ]);

  return (
    <main className='extrinsics--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Switch>
        <Route path={`${basePath}/decode`}><Decoder /></Route>
        <Route>
          <Submission />
        </Route>
      </Switch>
    </main>
  );
}

export { ExtrinsicsApp };

export default React.memo(ExtrinsicsApp);
