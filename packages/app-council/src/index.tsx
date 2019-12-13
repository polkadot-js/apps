// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Route, Switch } from 'react-router';
import styled from 'styled-components';
import { Proposals, Tabs } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Overview from './Overview';
import Candidates from './Candidates';
import Summary from './Summary';
import useElectionsInfo from './useElectionsInfo';
import translate from './translate';

export { default as useCounter } from './useCounter';

interface Props extends AppProps, BareProps, I18nProps {}

function CouncilApp ({ basePath, className, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const componentProps = useElectionsInfo(api);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const motions = useCall<Hash[]>(api.query.council.proposals, []);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          items={[
            {
              isRoot: true,
              name: 'overview',
              text: t('Council overview')
            },
            {
              name: 'candidates',
              text: t('Candidates')
            },
            {
              name: 'motions',
              text: t('Motions ({{count}})', { replace: { count: motions?.length || 0 } })
            }
          ]}
        />
      </header>
      <Summary
        bestNumber={bestNumber}
        electionsInfo={componentProps.electionsInfo}
      />
      <Switch>
        <Route
          path={`${basePath}/candidates`}
          render={
            (): React.ReactElement => <Candidates {...componentProps} />
          }
        />
        <Route
          path={`${basePath}/motions`}
          render={
            (): React.ReactElement => <Proposals collective='council' />
          }
        />
        <Route
          exact
          render={
            (): React.ReactElement => <Overview {...componentProps} />
          }
        />
      </Switch>
    </main>
  );
}

export default translate(
  styled(CouncilApp)`
    .council--hidden {
      display: none;
    }
  `
);
