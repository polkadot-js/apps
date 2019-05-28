// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Tabs } from '@polkadot/ui-app';

import Selection from './Selection';
import translate from './translate';

type Props = AppProps & I18nProps;

class ExtrinsicsApp extends React.PureComponent<Props> {
  render () {
    const { basePath, t } = this.props;

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
}

export { ExtrinsicsApp };

export default translate(ExtrinsicsApp);
