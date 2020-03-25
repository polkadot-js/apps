// Copyright 2017-2020 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps, QueryTypes, ParitalQueryTypes } from '../types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';

import Consts from './Consts';
import Modules from './Modules';
import Raw from './Raw';
import { useTranslation } from '../translate';

interface Props {
  basePath: string;
  onAdd: (query: QueryTypes) => void;
}

let id = -1;

function Selection ({ basePath, onAdd }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const items = useMemo(() => [
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
  ], [t]);

  const _onAdd = (query: ParitalQueryTypes): void => onAdd({ ...query, id: ++id });
  const _renderComponent = (Component: React.ComponentType<ComponentProps>): () => React.ReactNode =>
    // eslint-disable-next-line react/display-name
    (): React.ReactNode => <Component onAdd={_onAdd} />;

  return (
    <>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
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

export default React.memo(Selection);
