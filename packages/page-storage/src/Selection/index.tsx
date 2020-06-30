// Copyright 2017-2020 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueryTypes, ParitalQueryTypes } from '../types';

import React, { useCallback, useMemo } from 'react';
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
      text: t<string>('Storage')
    },
    {
      name: 'constants',
      text: t<string>('Constants')
    },
    {
      name: 'raw',
      text: t<string>('Raw storage')
    }
  ], [t]);

  const _onAdd = useCallback(
    (query: ParitalQueryTypes): void => onAdd({ ...query, id: ++id }),
    [onAdd]
  );

  return (
    <>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/constants`}><Consts onAdd={_onAdd} /></Route>
        <Route path={`${basePath}/raw`}><Raw onAdd={_onAdd} /></Route>
        <Route><Modules onAdd={_onAdd} /></Route>
      </Switch>
    </>
  );
}

export default React.memo(Selection);
