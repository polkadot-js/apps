// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import useExtensions from './useExtensions';

export default function useCounter (): number {
  const { count } = useExtensions();

  return count;
}
