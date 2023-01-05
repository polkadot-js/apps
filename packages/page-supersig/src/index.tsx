// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef, useState } from 'react';
import { Route, Switch } from 'react-router';
import type { TFunction } from 'i18next';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import type { AppProps } from '@polkadot/react-components/types';
import type { TabItem } from '@polkadot/react-components/Tabs/types';
import basicMd from './md/basic.md';
import { Submission, Decoder, Decoded } from './Extrinsics';
import type { DecodedExtrinsic } from './Extrinsics/types';
import Execute from './Execute';
import Overview from './Accounts';
import { useTranslation } from './translate';


export { default as useCounter } from './useCounter';

interface Props {
  basePath: string;
}

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
      // isRoot: true,
      name: 'dashboard',
      text: t<string>('Dashboard')
    },
    {
      name: 'supersigs',
      text: t<string>('Supersigs')
    },
    {
      name: 'proposals',
      text: t<string>('Proposals')
    },
    {
      name: 'create',
      text: t<string>('Create/Approve')
    },
    {
      hasParams: true,
      name: 'decode',
      text: t<string>('Decode')
    }
  ];
}



function SupersigApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [decoded, setDecoded] = useState<DecodedExtrinsic | null>(null);
  const itemsRef = useRef(createItemsRef(t));
  const pathRef = useRef(createPathRef(basePath));


  

  return (
    <main className='supersig--App'>
      <HelpOverlay md={basicMd as string} />
      <Tabs
        basePath={basePath}
       // items2={items}
       items={itemsRef.current} 
      />
      
      <Switch>
        <Route path={`${basePath}/dashboard`}>
        <Overview />
        </Route>
        <Route path={`${basePath}/supersigs`}>
        </Route>
        <Route path={`${basePath}/proposals`}>
        </Route>
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

export default React.memo(SupersigApp);
