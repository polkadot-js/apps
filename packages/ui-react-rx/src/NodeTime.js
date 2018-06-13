// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import storage from '@polkadot/storage';

import withStorageDiv from './with/storageDiv';

export default withStorageDiv(storage.timestamp.public.current)(
  (value?: Date): string => {
    if (!value || value.getTime() === 0) {
      return 'unknown';
    }

    return value.toString();
  },
  { className: 'rx--NodeTime' }
);
