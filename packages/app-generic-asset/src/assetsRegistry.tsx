// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BehaviorSubject } from 'rxjs';
import { reservedAssets } from '@polkadot/app-generic-asset/asset-util';
import { useApi, useCall } from '@polkadot/react-hooks';

const ASSETS_KEY = "cennznet-assets";
export const STAKING_ASSET_NAME = "CENNZ";
export const SPENDING_ASSET_NAME = "CPAY";

export interface AssetsSubjectInfo { [id: string]: string }

let initialAssets: AssetsSubjectInfo = {};

try {
  const storedAsset = localStorage.getItem(ASSETS_KEY);
  if (storedAsset) {
    initialAssets = JSON.parse(storedAsset);
  } else {
    initialAssets = reservedAssets;
  }
} catch (e) {
  // ignore error
}

const subject = new BehaviorSubject(initialAssets);

subject.subscribe((assets): void =>
  localStorage.setItem(ASSETS_KEY, JSON.stringify(assets))
);

export default {
  getSpendingAssetId: (): string => {
    for (let [id, name] of Object.entries(subject.getValue())) {
      if (name === SPENDING_ASSET_NAME) return id
    }
    // fallback, re-query the value
    const { api } = useApi();
    return useCall<string>(api.query.genericAsset.spendingAssetId() as any, [])!
  },
  getStakingAssetId: (): string => {
    for (let [id, name] of Object.entries(subject.getValue())) {
      if (name === STAKING_ASSET_NAME) return id
    }
    // fallback, re-query the value
    const { api } = useApi();
    return useCall<string>(api.query.genericAsset.stakingAssetId() as any, [])!
  },
  getAssets: (): AssetsSubjectInfo[] =>
    Object.entries(subject.getValue()).map(([id, name]): AssetsSubjectInfo => ({ id, name })),
  add: (id: string, name: string): void => {
    // Asset name exists already, update it's ID
    const assets = subject.getValue();
    for (let [existingId, existingName] of Object.entries(assets)) {
      if (name == existingName) {
        const { [existingId]: ignore, ...assetsNew } = assets;
        subject.next({
          ...assetsNew,
          [id]: name
        });
        return;
      }
    }
    // Add new asset
    subject.next({
      ...assets,
      [id]: name
    });
  },
  remove: (id: string): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [id]: ignore, ...assets } = subject.getValue();
    subject.next(assets);
  },
  subject
};
