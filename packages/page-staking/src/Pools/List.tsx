// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  className?: string;
}

function List ({ className }: Props): React.ReactElement<Props> {
  return (
    <div className={className} />
  );
}

export default React.memo(List);
