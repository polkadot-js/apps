// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function getMoreThanThresholdMembersCount (membersCount: number, thresholdRatio: number): number {
  if (membersCount === 0) { return 0; }

  return Math.floor(membersCount * thresholdRatio) + 1;
}

export function getAtLeastThresholdMembersCount (membersCount: number, thresholdRatio: number): number {
  return Math.ceil(membersCount * thresholdRatio);
}
