// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps, QueryTypes, ParitalQueryTypes } from '../types';

import React, { useContext } from 'react';
import { Route, Switch } from 'react-router';
import { ApiContext } from '@polkadot/react-api';
import { Tabs } from '@polkadot/react-components';

import Consts from './Consts';
import Modules from './Modules';
import Raw from './Raw';
import translate from '../translate';

interface Props extends I18nProps {
  basePath: string;
  onAdd: (query: QueryTypes) => void;
}

let id = -1;

function Selection ({ basePath, onAdd, t }: Props): React.ReactElement<Props> {
  const { isSubstrateV2 } = useContext(ApiContext);
  const _onAdd = (query: ParitalQueryTypes): void => onAdd({ ...query, id: ++id });
  const _renderComponent = (Component: React.ComponentType<ComponentProps>): () => React.ReactNode =>
    // eslint-disable-next-line react/display-name
    (): React.ReactNode => <Component onAdd={_onAdd} />;

  return (
    <>
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            isSubstrateV2
              ? []
              : ['constants']
          }
          items={[
            {
              isRoot: true,
              name: 'modules',
              text: t('Storage')
            },
            {
              name: 'constants',
              text: t('Constants')
            },
            {
              name: 'raw',
              text: t('Raw storage')
            }
          ]}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/constants`} render={_renderComponent(Consts)} />
        <Route path={`${basePath}/raw`} render={_renderComponent(Raw)} />
        <Route render={_renderComponent(Modules)} />
      </Switch>
    </>
  );
}

export default translate(Selection);
