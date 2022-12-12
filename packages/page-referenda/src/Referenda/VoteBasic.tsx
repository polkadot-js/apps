// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VoteTypeProps as Props } from './types';

import React, { useEffect } from 'react';

function VoteBasic ({ id, isAye, onChange }: Props): React.ReactElement<Props> | null {
  useEffect((): void => {
    onChange([
      id,
      isAye
    ]);
  }, [id, isAye, onChange]);

  return null;
}

export default React.memo(VoteBasic);
