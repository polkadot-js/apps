// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RouteProps } from '@polkadot/apps-routing/types';

import React from 'react';
import { Redirect } from 'react-router';

interface Props extends RouteProps {
  missingApis?: (string | string[])[];
}

function NotFound ({ basePath, missingApis = [] }: Props): React.ReactElement {
  console.log(`Redirecting from route "${basePath}" to "explorer", missing the following APIs: ${JSON.stringify(missingApis)}`);

  return (
    <Redirect to='/explorer' />
  );
}

export default React.memo(NotFound);
