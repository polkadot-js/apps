// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { TabItem } from '@polkadot/react-components/Tabs/types';
import type { AppProps as Props } from '@polkadot/react-components/types';
import type { DecodedExtrinsic } from './types';

import React, { useRef, useState } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Decoder from './Decoder';
import Submission from './Submission';
import { useTranslation } from './translate';

function createPathRef (basePath: string): Record<string, string | string[]> {
  return {
    decode: [
      `${basePath}/decode/:encoded`,
      `${basePath}/decode`
    ]
  };
}

function createItemsRef (t: TFunction): TabItem[] {
  return [
    {
      isRoot: true,
      name: 'create',
      text: t<string>('Submission')
    },
    {
      hasParams: true,
      name: 'decode',
      text: t<string>('Decode')
    }
  ];
}

function ExtrinsicsApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [decoded, setDecoded] = useState<DecodedExtrinsic | null>(null);
  const itemsRef = useRef(createItemsRef(t));
  const pathRef = useRef(createPathRef(basePath));

  return (
    <main className='extrinsics--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Switch>
        <Route path={pathRef.current.decode}>
          <Decoder
            defaultValue={decoded && decoded.hex}
            setLast={setDecoded}
          />
        </Route>
        <Route>
          <Submission defaultValue={decoded} />
        </Route>
      </Switch>
    </main>
  );
}

export { ExtrinsicsApp };

export default React.memo(ExtrinsicsApp);
