// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';
import type { BlockHeaders } from '../types';

import { blockHeaders } from '../subjects';
import calcHash from '../calcHash';

export default function transform (header: Header): BlockHeaders {
  const prev = blockHeaders.getValue();

  if (!header) {
    return prev;
  }

  const hash = calcHash(header);

  return prev.reduce((next, value, index) => {
    if (index < 9) {
      next.push(value);
    }

    return next;
  }, [{ hash, header }]);
}
