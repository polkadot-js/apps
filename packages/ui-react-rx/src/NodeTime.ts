// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import storage from '@polkadot/storage';

import withStorageDiv from './with/storageDiv';

// @ts-ignore check?
const method = storage.get('timestamp').public.current;

const Component: React.ComponentType<any> = withStorageDiv(method)(
  (value?: Date): string => {
    if (!value || value.getTime() === 0) {
      return 'unknown';
    }

    return value.toString();
  },
  { className: 'rx--NodeTime' }
);

export default Component;
