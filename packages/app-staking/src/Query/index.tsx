// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';
import { ComponentProps } from '../types';

import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Validator from './Validator';

interface Props extends BareProps, ComponentProps, RouteComponentProps<{}> {
  match: {
    isExact: boolean;
    params: {
      value: string;
    };
    path: string;
    url: string;
  };
}

function Query ({ stakingOverview, match: { params: { value } } }: Props): React.ReactElement<Props> {
  if (!stakingOverview) {
    return <div>loading</div>;
  }

  return (
    <Validator
      currentIndex={stakingOverview.currentIndex}
      validatorId={value}
    />
  );
}

export default withRouter(Query);
