// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from '../types';

import React from 'react';

import Members from './Members';
import Summary from './Summary';

export default function Overview ({ className, members, proposals }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Summary
        members={members}
        proposals={proposals}
      />
      <Members members={members} />
    </div>
  );
}
