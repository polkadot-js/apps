// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VoteResultItem } from './types';

import React from 'react';

interface Props {
  className?: string;
  value?: VoteResultItem[] | null | false;
}

function Activity ({ className, value }: Props): React.ReactElement<Props> | null {
  if (!value) {
    return null;
  }

  return <div className={className} />;
}

export default React.memo(Activity);
