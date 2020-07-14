// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BehaviorSubject } from 'rxjs';

const ASSETS_KEY = 'polkadot-app-generic-asset-assets';

export interface AssetsSubjectInfo { [id: string]: string }

let initalAssets: AssetsSubjectInfo = {};

try {
  const storedAsset = localStorage.getItem(ASSETS_KEY);

  if (storedAsset) {
    initalAssets = JSON.parse(storedAsset) as AssetsSubjectInfo;
  }
} catch (e) {
  // ignore error
}

const subject = new BehaviorSubject(initalAssets);

subject.subscribe((assets): void =>
  localStorage.setItem(ASSETS_KEY, JSON.stringify(assets))
);

export default {
  add: (id: string, name: string): void => {
    const assets = subject.getValue();

    subject.next({
      ...assets,
      [id]: name
    });
  },
  getAssets: (): AssetsSubjectInfo[] =>
    Object.entries(subject.getValue()).map(([id, name]): AssetsSubjectInfo => ({ id, name })),

  remove: (id: string): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [id]: ignore, ...assets } = subject.getValue();

    subject.next(assets);
  },
  subject
};
