// Copyright 2017-2023 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { LabelHelp } from '@polkadot/react-components';

import { insertSpaceBeforeCapitalLetter } from './helpers';
import { StatusName } from './types';

interface Props {
  bountyStatus: StatusName;
  className?: string;
}

function BountyStatusView ({ bountyStatus, className = '' }: Props): React.ReactElement<Props> {
  return (
    <div
      className={className}
      data-testid={'bountyStatus'}
    >
      {insertSpaceBeforeCapitalLetter(bountyStatus)}
      <LabelHelp />
    </div>
  );
}

export default React.memo(styled(BountyStatusView)`
  display: flex;
  align-items: center;
`);
