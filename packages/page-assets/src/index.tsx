// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AssetId } from '@polkadot/types/interfaces';

import React, { useMemo, useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import { BN_ONE } from '@polkadot/util';

import Balances from './Balances';
import Overview from './Overview';
import { useTranslation } from './translate';
import useAssetIds from './useAssetIds';
import useAssetInfos from './useAssetInfos';

interface Props {
  basePath: string;
  className?: string;
}

function findOpenId (ids?: AssetId[]): BN {
  if (!ids || !ids.length) {
    return BN_ONE;
  }

  const lastTaken = ids.find((id, index) =>
    index === 0
      ? !id.eq(BN_ONE)
      : !id.sub(BN_ONE).eq(ids[index - 1])
  );

  return lastTaken
    ? lastTaken.sub(BN_ONE)
    : ids[ids.length - 1].add(BN_ONE);
}

function AssetApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const ids = useAssetIds();
  const infos = useAssetInfos(ids);

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'balances',
      text: t<string>('Balances')
    }
  ]);

  const hidden = useMemo(
    () => (hasAccounts && infos && infos.some(({ details, metadata }) => !!(details && metadata)))
      ? []
      : ['balances'],
    [hasAccounts, infos]
  );

  const openId = useMemo(
    () => findOpenId(ids),
    [ids]
  );

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        hidden={hidden}
        items={tabsRef.current}
      />
      <Switch>
        <Route path={`${basePath}/balances`}>
          <Balances infos={infos} />
        </Route>
        <Route>
          <Overview
            ids={ids}
            infos={infos}
            openId={openId}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(AssetApp);
