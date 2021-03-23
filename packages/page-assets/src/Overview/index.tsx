// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      TODO
    </div>
  );
}

export default React.memo(Overview);
