// Copyright 2017-2020 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
