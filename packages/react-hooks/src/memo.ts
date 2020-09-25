// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import createMemo from 'memoizee';

// Normalize via JSON.stringify, allow e.g. AccountId -> ss58
// eslint-disable-next-line @typescript-eslint/unbound-method
const normalizer = JSON.stringify;

export default function memo <T extends (...args: any[]) => any> (inner: T): T {
  return createMemo(inner, { normalizer });
}
