// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { SortedTargets } from '../types';

import React from 'react';
import styled from 'styled-components';

import { useApi } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import SummaryBags from './SummaryBags';
import SummaryGeneral from './SummaryGeneral';
import SummaryNominators from './SummaryNominators';
import SummaryValidators from './SummaryValidators';

interface Props {
  className?: string;
  nominators?: string[];
  ownStashes?: StakerState[];
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  hasStashes?: boolean
}

function Overview ({ className = '',
  hasStashes,
  ownStashes,
  targets }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  return (
    <div className={`staking--Overview ${className}`}>
      <SummaryGeneral targets={targets} />
      <SummaryValidators targets={targets} />
      <SummaryNominators targets={targets} />
      {hasStashes && isFunction(api.query.bagsList?.counterForListNodes) && <SummaryBags ownStashes={ownStashes} />}
    </div>
  );
}

export const Title = styled.div`
  text-align: left;
  text-transform: lowercase;
  margin: 0 0 20px;
  font-weight: 400;
  font-size: 15px;
`;

export const Section = styled.section`
  width: 33%;
  justify-content: center;
`;

export default React.memo(styled(Overview)`
  article {
    justify-content: center;
  }
  .validator--Account-block-icon {
    display: inline-block;
    margin-right: 0.75rem;
    margin-top: -0.25rem;
    vertical-align: middle;
  }

  .validator--Summary-authors {
    .validator--Account-block-icon+.validator--Account-block-icon {
      margin-left: -1.5rem;
    }
  }
`);
