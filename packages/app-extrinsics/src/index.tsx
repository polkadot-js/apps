// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Tabs } from '@polkadot/react-components';

import Selection from './Selection';
import translate from './translate';

interface Props extends AppProps, I18nProps {}

function ExtrinsicsApp ({ basePath, t }: Props): React.ReactElement<Props> {
  return (
    <main className='extrinsics--App'>
      <header>
        <Tabs
          basePath={basePath}
          items={[{
            isRoot: true,
            name: 'create',
            text: t('Extrinsic submission')
          }]}
        />
      </header>
      <Selection />
    </main>
  );
}

export { ExtrinsicsApp };

export default translate(ExtrinsicsApp);
