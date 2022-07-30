// Copyright 2017-2022 @polkadot/app-referendums authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  basePath: string;
  className?: string;
}

function App ({ className }: Props): React.ReactElement<Props> {
  return (
    <div className={className} />
  );
}

export default React.memo(App);
