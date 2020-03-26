// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import useExtensions from './useExtensions';

export default function useCounter (): number {
  const { count } = useExtensions();

  return count;
}
