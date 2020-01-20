// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps } from '@polkadot/react-components/types';

import React from 'react';
import { Tabs } from '@polkadot/react-components';

import useCheck from './useCheck';
import Overview from './Overview';
import { useTranslation } from './translate';

export { useCheck };

interface Props extends AppProps, BareProps {}

export default function SocietyApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          items={[
            {
              isRoot: true,
              name: 'overview',
              text: t('Society overview')
            }
          ]}
        />
      </header>
      <Overview />
    </main>
  );
}
