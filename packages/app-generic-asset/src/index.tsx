// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps } from '@polkadot/react-components/types';
import { useApi, useCall } from '@polkadot/react-hooks';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';

import Transfer from './Transfer';
import Assets from './Assets';
import assetsRegistry, {STAKING_ASSET_NAME, SPENDING_ASSET_NAME} from './assetsRegistry';

import { useTranslation } from './translate';
import { AssetId } from '@cennznet/types/runtime';

interface Props extends AppProps, BareProps {}

export default function AssetApp ({ basePath }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  // Populate staking/CENNZ and spending/CPAY IDs from the connected chain
  const stakingAssetId = useCall<AssetId>(api.query.genericAsset.stakingAssetId as any, []);
  if (stakingAssetId) {
    assetsRegistry.add(
      stakingAssetId.toNumber().toString(),
      STAKING_ASSET_NAME
    );
  }

  const spendingAssetId = useCall<AssetId>(api.query.genericAsset.spendingAssetId as any, []);
  if (spendingAssetId) {
    assetsRegistry.add(
      spendingAssetId.toNumber().toString(),
      SPENDING_ASSET_NAME
    );
  }

  const { t } = useTranslation();
  const items = useMemo(() => [
    // {
    //   isRoot: true,
    //   name: 'assets',
    //   text: t('Assets')
    // },
    {
      isRoot: true,
      name: 'transfer',
      text: t('Transfer')
    }
  ], [t]);

  return (
    <main className='treasury--App'>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}`} component={Transfer} />
        <Route component={Assets} />
      </Switch>
    </main>
  );
}
