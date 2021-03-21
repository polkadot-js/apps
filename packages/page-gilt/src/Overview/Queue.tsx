// Copyright 2017-2021 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  className?: string;
}

function Queue ({ className }: Props): React.ReactElement<Props> {
  return (
    <tr className={className} />
  );
}

export default React.memo(Queue);
