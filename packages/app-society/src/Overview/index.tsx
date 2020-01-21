// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import Candidates from './Candidates';
import Members from './Members';
import Summary from './Summary';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Summary />
      <Members />
      <Candidates />
    </div>
  );
}

export default styled(Overview)`
  .overviewSection {
    margin-bottom: 1.5rem;
  }
`;
