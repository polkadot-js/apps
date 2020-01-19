// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Summary from './Summary';

interface Props {
  className?: string;
}

export default function Overview ({ className }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Summary />
    </div>
  );
}
