// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BehaviorSubject } from 'rxjs';

const ASSETS_KEY = 'polkadot-app-generic-asset-assets'

export type AssetsSubjectInfo = { [id: string]: string };

let initalAssets: AssetsSubjectInfo = {};

try {
  const storedAsset = localStorage.getItem(ASSETS_KEY);
  if (storedAsset) {
    initalAssets = JSON.parse(storedAsset)
  }
} catch (e) {
  // ignore error
}

const subject = new BehaviorSubject(initalAssets);

subject.subscribe(assets =>
  localStorage.setItem(ASSETS_KEY, JSON.stringify(assets))
);

export default {
  getAssets: () => Object.entries(subject.getValue()).map(([id, name]) => ({ id, name })),
  add: (id: string, name: string) => {
    const assets = subject.getValue();
    subject.next({
      ...assets,
      [id]: name
    })
  },
  remove: (id: string) => {
    const { [id]: ignore, ...assets } = subject.getValue();
    subject.next(assets);
  },
  subject
};

