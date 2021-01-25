// Copyright 2017-2021 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import usePolkadotPreclaims from './usePolkadotPreclaims';

export default function useCounter (): number {
  const needAttest = usePolkadotPreclaims();

  return needAttest.length;
}
