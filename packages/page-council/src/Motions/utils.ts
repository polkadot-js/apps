// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MemberCount } from '@polkadot/types/interfaces';

interface Params {
  isAye?: boolean;
  members: string[];
  threshold?: MemberCount;
}

function getMaxThreshold ({ isAye, members, threshold }: Params): number {
  const num = threshold?.toNumber() || 0;

  return isAye
    ? num
    : members?.length
      ? (members.length - num) + 1
      : 0;
}

export default getMaxThreshold;
