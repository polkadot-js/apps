// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import storage from '@polkadot/storage';

import numberFormat from './util/numberFormat';
import withStorageDiv from './with/storageDiv';

export default withStorageDiv(storage.system.public.accountIndexOf)(
  numberFormat,
  { className: 'rx--Nonce' }
);
