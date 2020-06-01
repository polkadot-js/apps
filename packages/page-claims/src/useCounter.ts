// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import usePreclaimPolkadotAddresses from './usePreclaimPolkadotAddresses';

export default function useCounter (): number {
  const needAttest = usePreclaimPolkadotAddresses();

  return needAttest ? needAttest.length : 0;
}
