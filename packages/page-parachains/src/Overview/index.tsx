// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import Parachains from './Parachains';
import Summary from './Summary';
import Upcoming from './Upcoming';

interface Props {
  className?: string;
}

function Overview (): React.ReactElement<Props> {
  const { api } = useApi();
  const paraIds = useCall<ParaId[]>(api.query.paras?.parachains);
  const upcomingIds = useCall<ParaId[]>(api.query.paras?.upcomingParas);

  return (
    <>
      <Summary
        parachainCount={paraIds?.length}
        upcomingCount={upcomingIds?.length}
      />
      {api.query.paras && (
        <>
          <Parachains ids={paraIds} />
          <Upcoming ids={upcomingIds} />
        </>
      )}
    </>
  );
}

export default React.memo(Overview);
