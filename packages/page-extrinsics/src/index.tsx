// Copyright 2017-2020 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Tabs } from '@polkadot/react-components';

import Selection from './Selection';
import { useTranslation } from './translate';

function ExtrinsicsApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([{
    isRoot: true,
    name: 'create',
    text: t<string>('Extrinsic submission')
  }]);

  return (
    <main className='extrinsics--App'>
      <header>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
      </header>
      <Selection />
    </main>
  );
}

export { ExtrinsicsApp };

export default React.memo(ExtrinsicsApp);
